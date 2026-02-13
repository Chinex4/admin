import React, { useEffect, useMemo, useState } from 'react';
import AddP2PTraderModal from '../../components/modals/AddP2PTraderModal';
import EditP2PTraderModal from '../../components/modals/EditP2PTraderModal';
import axiosInstance from '../../utils/axiosInstance';
import { showError } from '../../utils/toast';
import { normalizeTrader } from '../../utils/p2p';

const P2PPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [traders, setTraders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const PAGE_SIZE = 8;
  const columns = useMemo(
    () => [
      'Name',
      'Username',
      'Verified',
      'Email',
      'SMS',
      'ID Verification',
      'Completion',
      'Orders',
      'Price',
      'Limits',
      'Quantity',
      'Avg Release',
      'Payment',
      'Country',
      'Status',
      'Last Active',
      'Ad Type',
      'Top Seller',
      'Action',
    ],
    []
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchTraders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('admin/p2pTraders');
      const list = res?.data?.message ?? res?.data ?? [];
      const normalized = Array.isArray(list)
        ? list.map((item, index) => normalizeTrader(item, index))
        : [];
      setTraders(normalized);
    } catch (error) {
      console.error('Error fetching P2P traders:', error);
      const msg = 'Failed to fetch P2P traders';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraders();
  }, []);

  const filteredTraders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return traders;

    return traders.filter((trader) =>
      Object.values(trader)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [traders, search]);

  const isSearching = search.trim() !== '';
  const totalPages = Math.max(1, Math.ceil(filteredTraders.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = isSearching
    ? filteredTraders
    : filteredTraders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="panel panel-pad">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">P2P Traders</h2>
            <p className="muted-text mt-2">
              List will populate from the API. Use search to filter results.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search traders..."
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
              Add P2P
            </button>
          </div>
        </div>

        <div className="mt-4 table-wrap scrollbar-hide">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-3 py-2 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-row">
                  <td className="px-3 py-3" colSpan={columns.length}>
                    Loading traders...
                  </td>
                </tr>
              ) : error ? (
                <tr className="table-row">
                  <td className="px-3 py-3 text-red-400" colSpan={columns.length}>
                    <div className="flex items-center justify-between gap-3">
                      <span>{error}</span>
                      <button
                        className="button-ghost text-xs"
                        onClick={fetchTraders}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr className="table-row">
                  <td className="px-3 py-3" colSpan={columns.length}>
                    No P2P traders found.
                  </td>
                </tr>
              ) : (
                pageItems.map((trader) => (
                  <tr key={trader.id} className="table-row">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      @{trader.username}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.verified}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.emailVerified ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.smsVerified ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.idVerified ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.completion}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.orders}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.price}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.limits}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.quantity}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.avgRelease}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.payment}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.country}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.status}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.lastActive}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.adType}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {trader.topSeller ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button
                        className="button-ghost text-xs"
                        onClick={() => setSelectedTrader(trader)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-200">
          <span>
            {isSearching
              ? `Showing ${filteredTraders.length} matching trader(s)`
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
      <AddP2PTraderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={(newTrader) => {
          const normalized = normalizeTrader(newTrader);
          setTraders((prev) => [normalized, ...prev]);
          setPage(1);
        }}
      />
      <EditP2PTraderModal
        trader={selectedTrader}
        onClose={() => setSelectedTrader(null)}
        onUpdated={(updatedTrader) => {
          const normalized = normalizeTrader(updatedTrader);
          setTraders((prev) =>
            prev.map((item) =>
              item.id === normalized.id ? normalized : item
            )
          );
        }}
      />
    </div>
  );
};

export default P2PPage;
