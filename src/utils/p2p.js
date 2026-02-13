const TRUE_STRINGS = new Set(['true', '1', 'yes', 'y']);

export const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return TRUE_STRINGS.has(value.trim().toLowerCase());
  }
  return false;
};

export const toYesNo = (value) => (toBoolean(value) ? 'Yes' : 'No');

const toStringOrEmpty = (value) =>
  value === null || value === undefined ? '' : String(value);

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
  status: toStringOrEmpty(order.status),
  createdAt: toStringOrEmpty(order.createdAt),
});
