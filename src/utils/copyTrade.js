import { normalizeTrader } from './p2p';

const toStringOrEmpty = (value) =>
  value === null || value === undefined ? '' : String(value);

const pick = (obj, keys, fallback = '') => {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return fallback;
};

export const normalizeCopyTradeTrader = (trader = {}, index = 0) => {
  const base = normalizeTrader(trader, index);

  return {
    ...base,
    id: pick(trader, ['id', '_id'], base.id),
    display_name: toStringOrEmpty(
      pick(trader, ['display_name', 'displayName', 'name'], base.name)
    ),
    avatar: toStringOrEmpty(pick(trader, ['avatar', 'avatar_url', 'avatarUrl'], '')),
    username: toStringOrEmpty(pick(trader, ['username'], base.username)).replace(
      /^@/,
      ''
    ),
    status: toStringOrEmpty(
      pick(trader, ['status'], base.status || 'active')
    ).toLowerCase(),
    kyc_status: toStringOrEmpty(
      pick(trader, ['kyc_status', 'kycStatus', 'kyc_statuses'], '')
    ),
    copiers_count: toStringOrEmpty(
      pick(trader, ['copiers_count', 'copiersCount', 'subscribers', 'followers'], '')
    ),
    aum_usd: toStringOrEmpty(pick(trader, ['aum_usd', 'aumUsd', 'aum'], '')),
    total_return_pct: toStringOrEmpty(
      pick(trader, ['total_return_pct', 'totalReturnPct'], '')
    ),
    roi_30d_pct: toStringOrEmpty(
      pick(trader, ['roi_30d_pct', 'roi30d', 'roi_30d', 'roi'], '')
    ),
    roi_90d_pct: toStringOrEmpty(pick(trader, ['roi_90d_pct', 'roi90d'], '')),
    profit_factor: toStringOrEmpty(pick(trader, ['profit_factor', 'profitFactor'], '')),
    total_trades: toStringOrEmpty(pick(trader, ['total_trades', 'totalTrades'], '')),
    max_drawdown_pct: toStringOrEmpty(
      pick(trader, ['max_drawdown_pct', 'maxDrawdownPct', 'max_drawdown'], '')
    ),
    volatility_30d: toStringOrEmpty(
      pick(trader, ['volatility_30d', 'volatility30d'], '')
    ),
    sharpe_ratio: toStringOrEmpty(pick(trader, ['sharpe_ratio', 'sharpeRatio'], '')),
    avg_leverage: toStringOrEmpty(pick(trader, ['avg_leverage', 'avgLeverage'], '')),
    risk_score: toStringOrEmpty(pick(trader, ['risk_score', 'riskScore'], '')),
    liquidation_events: toStringOrEmpty(
      pick(trader, ['liquidation_events', 'liquidationEvents'], '')
    ),
    win_rate_pct: toStringOrEmpty(
      pick(trader, ['win_rate_pct', 'winRatePct', 'winRate'], '')
    ),
    profit_share_pct: toStringOrEmpty(
      pick(trader, ['profit_share_pct', 'profitSharePct', 'profitShares'], '')
    ),
    management_fee_pct: toStringOrEmpty(
      pick(trader, ['management_fee_pct', 'managementFeePct'], '')
    ),
    min_copy_amount_usd: toStringOrEmpty(
      pick(trader, ['min_copy_amount_usd', 'minCopyAmountUsd', 'minCopyAmount'], '')
    ),
    max_copiers: toStringOrEmpty(pick(trader, ['max_copiers', 'maxCopiers'], '')),
    copy_mode: toStringOrEmpty(pick(trader, ['copy_mode', 'copyMode'], '')),
    slippage_limit_pct: toStringOrEmpty(
      pick(trader, ['slippage_limit_pct', 'slippageLimitPct'], '')
    ),
    markets: toStringOrEmpty(pick(trader, ['markets'], '')),
    instruments: toStringOrEmpty(pick(trader, ['instruments'], '')),
    time_horizon: toStringOrEmpty(pick(trader, ['time_horizon', 'timeHorizon'], '')),
    strategy_description: toStringOrEmpty(
      pick(trader, ['strategy_description', 'strategyDescription'], '')
    ),
    tags: toStringOrEmpty(pick(trader, ['tags'], '')),
    verified_track_record: toStringOrEmpty(
      pick(trader, ['verified_track_record', 'verifiedTrackRecord'], '')
    ),
    exchange_linked: toStringOrEmpty(
      pick(trader, ['exchange_linked', 'exchangeLinked'], '')
    ),
    warning_flags: toStringOrEmpty(pick(trader, ['warning_flags', 'warningFlags'], '')),
    terms_accepted_at: toStringOrEmpty(
      pick(trader, ['terms_accepted_at', 'termsAcceptedAt'], '')
    ),
    last_active_at: toStringOrEmpty(
      pick(trader, ['last_active_at', 'lastActiveAt', 'lastActive'], base.lastActive)
    ),
    created_at: toStringOrEmpty(
      pick(trader, ['created_at', 'createdAt', 'dateCreated'], '')
    ),
    is_public: toStringOrEmpty(pick(trader, ['is_public', 'isPublic'], '')),
  };
};
