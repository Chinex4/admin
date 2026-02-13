const TRUE_STRINGS = new Set(['true', '1', 'yes', 'y']);

const toStringOrEmpty = (value) =>
  value === null || value === undefined ? '' : String(value);

const parseJsonSafe = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null') return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
};

const pad2 = (value) => String(value).padStart(2, '0');

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return toStringOrEmpty(value);
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const normalizeStatus = (value) => {
  const raw = toStringOrEmpty(value).trim().toLowerCase();
  if (!raw) return '';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return TRUE_STRINGS.has(value.trim().toLowerCase());
  }
  return false;
};

export const toYesNo = (value) => (toBoolean(value) ? 'Yes' : 'No');

export const normalizeTrader = (trader = {}, index = 0) => {
  const id =
    trader.id ?? trader._id ?? `${trader.username || trader.name || 'trader'}-${index}`;
  const rawPaymentMethods = trader.paymentMethods;
  let paymentMethods = [];
  if (Array.isArray(rawPaymentMethods)) {
    paymentMethods = rawPaymentMethods;
  } else if (typeof rawPaymentMethods === 'string' && rawPaymentMethods.trim()) {
    try {
      const parsed = JSON.parse(rawPaymentMethods);
      if (Array.isArray(parsed)) {
        paymentMethods = parsed;
      } else {
        paymentMethods = rawPaymentMethods
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean);
      }
    } catch {
      paymentMethods = rawPaymentMethods
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }
  }

  return {
    id,
    name: toStringOrEmpty(trader.name),
    username: toStringOrEmpty(trader.username).replace(/^@/, ''),
    merchantType: toStringOrEmpty(trader.merchantType) || 'individual',
    verified: toYesNo(trader.verified),
    emailVerified: toBoolean(trader.emailVerified),
    smsVerified: toBoolean(trader.smsVerified),
    idVerified: toBoolean(trader.idVerified),
    asset: toStringOrEmpty(trader.asset),
    fiatCurrency: toStringOrEmpty(trader.fiatCurrency),
    priceType: toStringOrEmpty(trader.priceType) || 'fixed',
    priceValue: toStringOrEmpty(trader.priceValue),
    priceMargin: toStringOrEmpty(trader.priceMargin),
    referencePriceSource: toStringOrEmpty(trader.referencePriceSource),
    completion: toStringOrEmpty(trader.completion),
    orders: toStringOrEmpty(trader.orders),
    price: toStringOrEmpty(trader.price),
    limits: toStringOrEmpty(trader.limits),
    minLimit: toStringOrEmpty(trader.minLimit),
    maxLimit: toStringOrEmpty(trader.maxLimit),
    quantity: toStringOrEmpty(trader.quantity),
    availableQuantity: toStringOrEmpty(trader.availableQuantity),
    avgRelease: toStringOrEmpty(trader.avgRelease),
    avgReleaseMinutes: toStringOrEmpty(trader.avgReleaseMinutes),
    orderTimeLimitMinutes: toStringOrEmpty(trader.orderTimeLimitMinutes),
    payment: toStringOrEmpty(trader.payment),
    paymentMethods,
    country: toStringOrEmpty(trader.country),
    kycRequired: toStringOrEmpty(trader.kycRequired) || 'none',
    terms: toStringOrEmpty(trader.terms),
    paymentWindow: toStringOrEmpty(trader.paymentWindow),
    status: toStringOrEmpty(trader.status) || 'Active',
    isOnline: toBoolean(trader.isOnline),
    isHidden: toBoolean(trader.isHidden),
    isDeleted: toBoolean(trader.isDeleted),
    lastActive: toStringOrEmpty(trader.lastActive),
    adType: toStringOrEmpty(trader.adType),
    topSeller: toBoolean(trader.topSeller),
  };
};

export const normalizeOrder = (order = {}, index = 0) => ({
  id: order.id ?? `${order.orderId || 'order'}-${index}`,
  orderId: toStringOrEmpty(order.orderId),
  userId: toStringOrEmpty(order.userId),
  adType: toStringOrEmpty(order.adType),
  coin: toStringOrEmpty(order.coin),
  fiat: toStringOrEmpty(order.fiat),
  fiatAmount: toStringOrEmpty(order.fiatAmount),
  cryptoAmount: toStringOrEmpty(order.cryptoAmount),
  price: toStringOrEmpty(order.price),
  paymentMethod: toStringOrEmpty(order.paymentMethod),
  merchant: toStringOrEmpty(order.merchant),
  orders: toStringOrEmpty(order.orders),
  completion: toStringOrEmpty(order.completion),
  limitRange: toStringOrEmpty(order.limitRange),
  quantity: toStringOrEmpty(order.quantity),
  status: normalizeStatus(order.status),
  createdAt: formatDateTime(order.createdAt),
  updatedAt: formatDateTime(order.updatedAt),
  confirmedAt: formatDateTime(order.confirmedAt),
  releasedAt: toStringOrEmpty(order.releasedAt),
  userRelease: toYesNo(order.userRelease),
  reservedAmount: toStringOrEmpty(order.reservedAmount),
  paymentMethods: parseJsonSafe(order.paymentMethods) ?? [],
  paymentTiming: parseJsonSafe(order.paymentTiming),
  paymentDetails: parseJsonSafe(order.paymentDetails),
  uploadedImages: parseJsonSafe(order.uploadedImages) ?? [],
});
