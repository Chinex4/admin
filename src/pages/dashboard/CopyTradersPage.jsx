import React, { useEffect, useMemo, useState } from 'react';
import AddCopyTradeTraderModal from '../../components/modals/AddCopyTradeTraderModal';
import EditCopyTradeTraderModal from '../../components/modals/EditCopyTradeTraderModal';
import axiosInstance from '../../utils/axiosInstance';
import { showError } from '../../utils/toast';
import { normalizeCopyTradeTrader } from '../../utils/copyTrade';

const CopyTradersPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [copyTraders, setCopyTraders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCopyTrader, setSelectedCopyTrader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const PAGE_SIZE = 8;

  const columns = useMemo(
    () => [
      { key: 'id', label: 'id' },
      { key: 'display_name', label: 'display_name' },
      { key: 'username', label: 'username' },
      { key: 'avatar', label: 'avatar' },
      { key: 'status', label: 'status' },
      { key: 'kyc_status', label: 'kyc_status' },
      { key: 'copiers_count', label: 'copiers_count' },
      { key: 'aum_usd', label: 'aum_usd' },
      { key: 'total_return_pct', label: 'total_return_pct' },
      { key: 'roi_30d_pct', label: 'roi_30d_pct' },
      { key: 'roi_90d_pct', label: 'roi_90d_pct' },
      { key: 'profit_factor', label: 'profit_factor' },
      { key: 'total_trades', label: 'total_trades' },
      { key: 'max_drawdown_pct', label: 'max_drawdown_pct' },
      { key: 'volatility_30d', label: 'volatility_30d' },
      { key: 'sharpe_ratio', label: 'sharpe_ratio' },
      { key: 'avg_leverage', label: 'avg_leverage' },
      { key: 'risk_score', label: 'risk_score' },
      { key: 'liquidation_events', label: 'liquidation_events' },
      { key: 'win_rate_pct', label: 'win_rate_pct' },
      { key: 'profit_share_pct', label: 'profit_share_pct' },
      { key: 'management_fee_pct', label: 'management_fee_pct' },
      { key: 'min_copy_amount_usd', label: 'min_copy_amount_usd' },
      { key: 'max_copiers', label: 'max_copiers' },
      { key: 'copy_mode', label: 'copy_mode' },
      { key: 'slippage_limit_pct', label: 'slippage_limit_pct' },
      { key: 'markets', label: 'markets' },
      { key: 'instruments', label: 'instruments' },
      { key: 'time_horizon', label: 'time_horizon' },
      { key: 'strategy_description', label: 'strategy_description' },
      { key: 'tags', label: 'tags' },
      { key: 'verified_track_record', label: 'verified_track_record' },
      { key: 'exchange_linked', label: 'exchange_linked' },
      { key: 'warning_flags', label: 'warning_flags' },
      { key: 'terms_accepted_at', label: 'terms_accepted_at' },
      { key: 'last_active_at', label: 'last_active_at' },
      { key: 'created_at', label: 'created_at' },
      { key: 'is_public', label: 'is_public' },
      { key: '__action__', label: 'Action' },
    ],
    []
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchCopyTraders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('admin/fetchcopytrade');
      const list = res?.data?.message ?? res?.data ?? [];
      const normalized = Array.isArray(list)
        ? list.map((item, index) => normalizeCopyTradeTrader(item, index))
        : [];
      setCopyTraders(normalized);
    } catch (err) {
      console.error('Error fetching copy traders:', err);
      const msg = 'Failed to fetch copy traders';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCopyTraders();
  }, []);

  const filteredCopyTraders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return copyTraders;

    return copyTraders.filter((copyTrader) =>
      Object.values(copyTrader)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [copyTraders, search]);

  const isSearching = search.trim() !== '';
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCopyTraders.length / PAGE_SIZE)
  );
  const safePage = Math.min(page, totalPages);
  const pageItems = isSearching
    ? filteredCopyTraders
    : filteredCopyTraders.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
      );

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return '--';
    return value;
  };

  const renderCell = (copyTrader, key, rowIndex) => {
    if (key === 'id') return rowIndex;
    if (key === '__action__') {
      return (
        <button
          className="button-ghost text-xs"
          onClick={() => setSelectedCopyTrader(copyTrader)}
        >
          Edit
        </button>
      );
    }
    if (key === 'avatar') {
      const avatarValue = copyTrader.avatar;
      if (!avatarValue) return '--';
      return (
        <button
          type="button"
          className="focus:outline-none"
          onClick={() => setPreviewImage(avatarValue)}
        >
          <img
            src={avatarValue}
            alt={copyTrader.display_name || 'avatar'}
            className="h-8 w-8 rounded-full object-cover border border-slate-700"
          />
        </button>
      );
    }
    return formatValue(copyTrader[key]);
  };

  return (
    <div className="space-y-5">
      <div className="panel panel-pad">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Copy Traders</h2>
            <p className="muted-text mt-2">
              List will populate from the API. Use search to filter results.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search copy traders..."
            className="input-dark md:max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button
              className="button-primary text-xs"
              onClick={() => setShowAddModal(true)}
            >
              Add Copy Trader
            </button>
          </div>
        </div>

        <div className="mt-4 table-wrap scrollbar-hide">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-2 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-row">
                  <td className="px-3 py-3" colSpan={columns.length}>
                    Loading copy traders...
                  </td>
                </tr>
              ) : error ? (
                <tr className="table-row">
                  <td
                    className="px-3 py-3 text-red-400"
                    colSpan={columns.length}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>{error}</span>
                      <button
                        className="button-ghost text-xs"
                        onClick={fetchCopyTraders}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr className="table-row">
                  <td className="px-3 py-3" colSpan={columns.length}>
                    No copy traders found.
                  </td>
                </tr>
              ) : (
                pageItems.map((copyTrader, index) => (
                  <tr key={copyTrader.id} className="table-row">
                    {columns.map((col) => (
                      <td key={`${copyTrader.id}-${col.key}`} className="px-3 py-2 whitespace-nowrap">
                        {renderCell(
                          copyTrader,
                          col.key,
                          isSearching
                            ? index + 1
                            : (safePage - 1) * PAGE_SIZE + index + 1
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-200">
          <span>
            {isSearching
              ? `Showing ${filteredCopyTraders.length} matching copy trader(s)`
              : `Page ${safePage} of ${totalPages}`}
          </span>
          <div className="flex gap-2">
            <button
              className="button-ghost text-xs"
              disabled={isSearching || safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              className="button-ghost text-xs"
              disabled={isSearching || safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </div>

      <AddCopyTradeTraderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={(newCopyTrader) => {
          const normalized = normalizeCopyTradeTrader(newCopyTrader);
          setCopyTraders((prev) => [normalized, ...prev]);
          setPage(1);
        }}
      />
      <EditCopyTradeTraderModal
        trader={selectedCopyTrader}
        onClose={() => setSelectedCopyTrader(null)}
        onUpdated={(updatedCopyTrader) => {
          const normalized = normalizeCopyTradeTrader(updatedCopyTrader);
          setCopyTraders((prev) =>
            prev.map((item) => (item.id === normalized.id ? normalized : item))
          );
        }}
      />

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute right-2 top-2 button-ghost text-xs"
              onClick={() => setPreviewImage(null)}
            >
              Close
            </button>
            <img
              src={previewImage}
              alt="Avatar preview"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyTradersPage;
