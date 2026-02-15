import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { showError, showSuccess } from '../../utils/toast';
import { Popover } from '@headlessui/react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCopiedTraderActionError,
  setCopiedTraders,
} from '../../slices/copiedTraderSlice';
import {
  approveCopyTradeOrder,
  deleteCopyTradeOrder,
  disapproveCopyTradeOrder,
  editCopyTradeOrder,
} from '../../redux/thunks/copyTradeOrdersThunk';

const PAGE_SIZE = 10;

const normalizeCopyTradeOrder = (item = {}, index = 0) => ({
  id: item?.id ?? `row-${index}`,
  copyRequestId: item?.copyRequestId ?? '',
  userId: item?.userId ?? '',
  traderId: item?.traderId ?? '',
  amountMode: item?.amountMode ?? '',
  amountPerOrder: item?.amountPerOrder ?? '',
  amount: item?.amount ?? '',
  stopLoss: item?.stopLoss ?? '',
  marginMode: item?.marginMode ?? '',
  leverageMode: item?.leverageMode ?? '',
  fixedLeverage: item?.fixedLeverage ?? '',
  slippageRange: item?.slippageRange ?? '',
  agree: item?.agree ?? '',
  status: item?.status ?? '',
  createdAt: item?.createdAt ?? '',
  updatedAt: item?.updatedAt ?? '',
  ipAddress: item?.ipAddress ?? '',
});

const parseEditValue = (value) => {
  const raw = String(value ?? '').trim();
  if (raw === '') return '';
  if (raw.toLowerCase() === 'true') return true;
  if (raw.toLowerCase() === 'false') return false;
  const maybeNumber = Number(raw);
  if (Number.isFinite(maybeNumber) && !raw.startsWith('0')) return maybeNumber;
  return raw;
};

const CopiedTradersPage = () => {
  const dispatch = useDispatch();
  const { copiedTraders: orders, actionLoading } = useSelector(
    (state) => state.copiedTraders
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState({ type: '', payload: null });
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('admin/fetchcopytradeorder');
      const payload = res?.data?.message ?? res?.data ?? [];
      const normalized = Array.isArray(payload)
        ? payload.map((item, index) => normalizeCopyTradeOrder(item, index))
        : [];
      dispatch(setCopiedTraders(normalized));
    } catch (err) {
      console.error('Failed to fetch copy trade orders:', err);
      const msg = 'Failed to fetch copy trade orders';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getOrderActionId = (order) => {
    const value = order?.id ?? order?.copyRequestId;
    return value === null || value === undefined ? '' : String(value).trim();
  };

  const openEditModal = (order) => {
    if (!order) return;
    setEditForm({
      copyRequestId: String(order.copyRequestId ?? ''),
      userId: String(order.userId ?? ''),
      amountMode: String(order.amountMode ?? ''),
      amountPerOrder: String(order.amountPerOrder ?? ''),
      amount: String(order.amount ?? ''),
      stopLoss: String(order.stopLoss ?? ''),
      marginMode: String(order.marginMode ?? ''),
      leverageMode: String(order.leverageMode ?? ''),
      fixedLeverage: String(order.fixedLeverage ?? ''),
      slippageRange: String(order.slippageRange ?? ''),
      agree: String(order.agree ?? ''),
      status: String(order.status ?? ''),
      createdAt: String(order.createdAt ?? ''),
      updatedAt: String(order.updatedAt ?? ''),
      ipAddress: String(order.ipAddress ?? ''),
    });
    setModal({ type: 'edit', payload: order });
  };

  const closeModal = () => {
    setModal({ type: '', payload: null });
    setEditForm({});
  };

  const handleEditSave = async () => {
    if (modal.type !== 'edit' || !modal.payload) return;
    const orderId = getOrderActionId(modal.payload);
    if (!orderId) {
      showError('Order identifier is missing');
      return;
    }
    dispatch(clearCopiedTraderActionError());
    try {
      const payload = Object.entries(editForm).reduce((acc, [key, value]) => {
        acc[key] = parseEditValue(value);
        return acc;
      }, {});
      await dispatch(editCopyTradeOrder({ orderId, payload })).unwrap();
      showSuccess('Copy trade order updated');
      closeModal();
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to edit copy trade order'
      );
    }
  };

  const handleDelete = async (order) => {
    const orderId = getOrderActionId(order);
    if (!orderId) {
      showError('Order identifier is missing');
      return;
    }
    if (!window.confirm(`Delete copy trade order ${orderId}?`)) return;
    dispatch(clearCopiedTraderActionError());
    try {
      await dispatch(deleteCopyTradeOrder(orderId)).unwrap();
      showSuccess('Copy trade order deleted');
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to delete copy trade order'
      );
    }
  };

  const handleApprove = async (order) => {
    const orderId = getOrderActionId(order);
    if (!orderId) {
      showError('Order identifier is missing');
      return;
    }
    dispatch(clearCopiedTraderActionError());
    try {
      await dispatch(approveCopyTradeOrder(orderId)).unwrap();
      showSuccess('Copy trade order approved');
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to approve copy trade order'
      );
    }
  };

  const handleDisapprove = async (order) => {
    const orderId = getOrderActionId(order);
    if (!orderId) {
      showError('Order identifier is missing');
      return;
    }
    dispatch(clearCopiedTraderActionError());
    try {
      await dispatch(disapproveCopyTradeOrder(orderId)).unwrap();
      showSuccess('Copy trade order disapproved');
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to disapprove copy trade order'
      );
    }
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return '-';
    const str = String(value);
    return str.trim() === '' ? '-' : str;
  };

  const formatNumber = (value, maximumFractionDigits = 2) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return value ?? '';
    return num.toLocaleString(undefined, { maximumFractionDigits });
  };

  const exportCsv = () => {
    const headers = [
      'copyRequestId',
      'userId',
      'amountMode',
      'amountPerOrder',
      'amount',
      'stopLoss',
      'marginMode',
      'leverageMode',
      'fixedLeverage',
      'slippageRange',
      'agree',
      'status',
      'createdAt',
      'updatedAt',
      'ipAddress',
    ];
    const rows = sortedOrders.map((order) => [
      order.copyRequestId,
      order.userId,
      order.amountMode,
      order.amountPerOrder,
      order.amount,
      order.stopLoss,
      order.marginMode,
      order.leverageMode,
      order.fixedLeverage,
      order.slippageRange,
      order.agree,
      order.status,
      order.createdAt,
      order.updatedAt,
      order.ipAddress,
    ]);
    const escapeCell = (cell) => {
      const value = cell === null || cell === undefined ? '' : String(cell);
      if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
      return value;
    };
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCell).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `copytrade-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSortValue = (order, key) => {
    if (!order) return '';
    if (key === 'createdAt' || key === 'updatedAt') {
      const date = order[key] ? new Date(order[key]) : null;
      return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
    }
    if (
      key === 'amountPerOrder' ||
      key === 'amount' ||
      key === 'stopLoss' ||
      key === 'fixedLeverage' ||
      key === 'slippageRange'
    ) {
      const num = Number(order[key]);
      return Number.isFinite(num) ? num : 0;
    }
    return String(order[key] ?? '').toLowerCase();
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const byStatus =
      statusFilter === 'all'
        ? orders
        : orders.filter(
            (order) =>
              String(order.status || '')
                .trim()
                .toLowerCase() === statusFilter
          );
    if (!q) return byStatus;
    return byStatus.filter((order) =>
      [
        order.copyRequestId,
        order.userId,
        order.amountMode,
        order.amountPerOrder,
        order.amount,
        order.stopLoss,
        order.marginMode,
        order.leverageMode,
        order.fixedLeverage,
        order.slippageRange,
        order.agree,
        order.status,
        order.createdAt,
        order.updatedAt,
        order.ipAddress,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [orders, search, statusFilter]);

  const sortedOrders = useMemo(() => {
    const copy = [...filteredOrders];
    copy.sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filteredOrders, sortDirection, sortKey]);

  const statusOptions = useMemo(() => {
    const base = new Set();
    orders.forEach((order) => {
      const value = String(order.status || '')
        .trim()
        .toLowerCase();
      if (value) base.add(value);
    });
    return ['all', ...Array.from(base).sort()];
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sortedOrders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const columns = useMemo(
    () => [
      'No.',
      'copyRequestId',
      'userId',
      'amountMode',
      'amountPerOrder',
      'amount',
      'stopLoss',
      'marginMode',
      'leverageMode',
      'fixedLeverage',
      'slippageRange',
      'agree',
      'status',
      'createdAt',
      'updatedAt',
      'ipAddress',
      'Action',
    ],
    []
  );

  const sortOptions = [
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' },
    { key: 'amountPerOrder', label: 'Amount Per Order' },
    { key: 'amount', label: 'Amount' },
    { key: 'stopLoss', label: 'Stop Loss' },
    { key: 'fixedLeverage', label: 'Fixed Leverage' },
    { key: 'status', label: 'Status' },
    { key: 'userId', label: 'User ID' },
  ];

  return (
    <div className="space-y-5">
      <div className="panel panel-pad">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Copy Trade Orders
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="button-ghost text-xs" onClick={exportCsv}>
                Export CSV
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-200">Status</label>
              <select
                className="input-dark text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all'
                      ? 'All'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-200">Sort by</label>
              <select
                className="input-dark text-xs"
                value={sortKey}
                onChange={(e) => toggleSort(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                className="button-ghost text-xs"
                onClick={() =>
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
              >
                {sortDirection === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Search copy trade orders..."
              className="input-dark w-full md:max-w-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="muted-text mt-6">Loading orders...</p>
        ) : error ? (
          <div className="mt-6 flex items-center justify-between gap-3 text-red-400">
            <p>{error}</p>
            <button className="button-ghost text-xs" onClick={fetchOrders}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 table-wrap scrollbar-hide max-h-[70vh] overflow-y-auto">
              <table className="table-base">
                <thead className="table-head sticky top-0 z-20 bg-slate-900/80 backdrop-blur">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-3 py-2 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr className="table-row">
                      <td className="px-3 py-3" colSpan={columns.length}>
                        No copy trade orders found.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((order, index) => (
                      <tr
                        key={order.id ?? order.copyRequestId}
                        className="table-row h-16"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          {(safePage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.copyRequestId)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.userId)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.amountMode)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(formatNumber(order.amountPerOrder, 8))}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(formatNumber(order.amount, 8))}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(formatNumber(order.stopLoss, 8))}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.marginMode)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.leverageMode)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.fixedLeverage)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.slippageRange)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.agree)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.status)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.createdAt)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.updatedAt)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {renderValue(order.ipAddress)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap relative z-10">
                          <Popover className="relative z-10">
                            {({ open }) => (
                              <div>
                                <Popover.Button className="icon-button">
                                  <i className="bi bi-three-dots-vertical" />
                                </Popover.Button>
                                {open && typeof document !== 'undefined'
                                  ? createPortal(
                                      <Popover.Panel className="fixed top-[50%] left-[43%] lg:left-[83%] transform -translate-x-1/2 -translate-y-1/2 z-[10000] menu-panel">
                                        {({ close }) => (
                                          <>
                                            <button
                                              className="w-full text-left px-2 py-1 hover:bg-[#151c26] rounded"
                                              onClick={() => {
                                                openEditModal(order);
                                                close();
                                              }}
                                            >
                                              Edit
                                            </button>
                                            <button
                                              className="w-full text-left px-2 py-1 hover:bg-[#151c26] rounded"
                                              onClick={() => {
                                                handleApprove(order);
                                                close();
                                              }}
                                              disabled={actionLoading}
                                            >
                                              Approve
                                            </button>
                                            <button
                                              className="w-full text-left px-2 py-1 hover:bg-[#151c26] rounded"
                                              onClick={() => {
                                                handleDisapprove(order);
                                                close();
                                              }}
                                              disabled={actionLoading}
                                            >
                                              Disapprove
                                            </button>
                                            <button
                                              className="w-full text-left px-2 py-1 hover:bg-rose-900/40 text-rose-200 rounded"
                                              onClick={() => {
                                                handleDelete(order);
                                                close();
                                              }}
                                              disabled={actionLoading}
                                            >
                                              Delete
                                            </button>
                                          </>
                                        )}
                                      </Popover.Panel>,
                                      document.body
                                    )
                                  : null}
                              </div>
                            )}
                          </Popover>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-200">
              <span>
                Page {safePage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  className="button-ghost text-xs"
                  disabled={safePage === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <button
                  className="button-ghost text-xs"
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {modal.type === 'edit' && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Copy Trade Order</h3>
              <button className="button-ghost text-xs" onClick={closeModal}>
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(editForm).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs text-slate-400">{key}</label>
                  <input
                    type="text"
                    className="input-dark w-full text-xs"
                    value={value}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="button-primary text-xs"
                onClick={handleEditSave}
                disabled={actionLoading}
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopiedTradersPage;
