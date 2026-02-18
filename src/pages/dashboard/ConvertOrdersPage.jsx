import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteConvertOrder,
  fetchConvertOrders,
  updateConvertOrder,
} from '../../redux/thunks/convertOrderThunk';
import {
  selectConvertOrderActionError,
  selectConvertOrderActionLoading,
  selectConvertOrders,
  selectConvertOrdersError,
  selectConvertOrdersLoading,
} from '../../selectors/convertOrderSelectors';
import { clearConvertOrderActionError } from '../../slices/convertOrderSlice';
import { showError, showSuccess } from '../../utils/toast';

const TABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'convertId', label: 'Convert ID' },
  { key: 'userId', label: 'User ID' },
  { key: 'fromSymbol', label: 'From Symbol' },
  { key: 'toSymbol', label: 'To Symbol' },
  { key: 'fromCoinId', label: 'From Coin ID' },
  { key: 'toCoinId', label: 'To Coin ID' },
  { key: 'fromAmount', label: 'From Amount' },
  { key: 'toAmount', label: 'To Amount' },
  { key: 'orderMode', label: 'Order Mode' },
  { key: 'quoteRate', label: 'Quote Rate' },
  { key: 'limitPrice', label: 'Limit Price' },
  { key: 'payload', label: 'Payload' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
];

const EDITABLE_KEYS = TABLE_COLUMNS.map((column) => column.key).filter(
  (key) => key !== 'id'
);

const toInputString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '';
    }
  }
  return String(value);
};

const normalizeOrder = (item = {}, index = 0) => ({
  id: item?.id ?? item?.convertId ?? `row-${index}`,
  convertId: item?.convertId ?? '',
  userId: item?.userId ?? '',
  fromSymbol: item?.fromSymbol ?? '',
  toSymbol: item?.toSymbol ?? '',
  fromCoinId: item?.fromCoinId ?? '',
  toCoinId: item?.toCoinId ?? '',
  fromAmount: item?.fromAmount ?? '',
  toAmount: item?.toAmount ?? '',
  orderMode: item?.orderMode ?? '',
  quoteRate: item?.quoteRate ?? '',
  limitPrice: item?.limitPrice ?? '',
  payload: item?.payload ?? '',
  status: item?.status ?? '',
  createdAt: item?.createdAt ?? '',
});

const formatValue = (value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') {
    try {
      const jsonValue = JSON.stringify(value);
      return jsonValue || '-';
    } catch {
      return '-';
    }
  }
  const stringValue = String(value).trim();
  return stringValue === '' ? '-' : stringValue;
};

const parseEditValue = (key, value) => {
  const trimmed = String(value ?? '').trim();
  if (trimmed === '') return '';
  if (key === 'payload') {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
};

const getActionId = (order) => {
  const value = order?.id ?? order?.convertId;
  return value === null || value === undefined ? '' : String(value).trim();
};

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

const ConvertOrdersPage = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectConvertOrders);
  const loading = useSelector(selectConvertOrdersLoading);
  const error = useSelector(selectConvertOrdersError);
  const actionLoading = useSelector(selectConvertOrderActionLoading);
  const actionError = useSelector(selectConvertOrderActionError);

  const [search, setSearch] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editForm, setEditForm] = useState({});

  const orders = useMemo(
    () => list.map((item, index) => normalizeOrder(item, index)),
    [list]
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) =>
      TABLE_COLUMNS.some((column) =>
        String(formatValue(order[column.key])).toLowerCase().includes(query)
      )
    );
  }, [orders, search]);

  useEffect(() => {
    dispatch(fetchConvertOrders())
      .unwrap()
      .catch((err) =>
        showError(typeof err === 'string' ? err : 'Failed to fetch convert orders')
      );
  }, [dispatch]);

  const retryFetch = () => {
    dispatch(fetchConvertOrders())
      .unwrap()
      .catch((err) =>
        showError(typeof err === 'string' ? err : 'Failed to fetch convert orders')
      );
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedOrder(null);
    setEditForm({});
  };

  const openEditModal = (order) => {
    if (!order) return;
    dispatch(clearConvertOrderActionError());
    setSelectedOrder(order);
    const initialForm = EDITABLE_KEYS.reduce((acc, key) => {
      acc[key] = toInputString(order[key]);
      return acc;
    }, {});
    setEditForm(initialForm);
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedOrder) return;
    const actionId = getActionId(selectedOrder);
    if (!actionId) {
      showError('Convert order identifier is missing');
      return;
    }
    dispatch(clearConvertOrderActionError());
    try {
      const payload = Object.entries(editForm).reduce((acc, [key, value]) => {
        acc[key] = parseEditValue(key, value);
        return acc;
      }, {});
      await dispatch(updateConvertOrder({ id: actionId, payload })).unwrap();
      showSuccess('Convert order updated');
      closeEditModal();
    } catch (err) {
      showError(typeof err === 'string' ? err : 'Failed to update convert order');
    }
  };

  const handleDelete = async (order) => {
    const actionId = getActionId(order);
    if (!actionId) {
      showError('Convert order identifier is missing');
      return;
    }
    if (!window.confirm(`Delete convert order ${actionId}?`)) return;
    dispatch(clearConvertOrderActionError());
    try {
      await dispatch(deleteConvertOrder(actionId)).unwrap();
      showSuccess('Convert order deleted');
    } catch (err) {
      showError(typeof err === 'string' ? err : 'Failed to delete convert order');
    }
  };

  return (
    <div className="space-y-5">
      <div className="panel panel-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-white">Convert Orders</h2>
          <input
            type="text"
            placeholder="Search convert orders..."
            className="input-dark w-full lg:max-w-md"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="muted-text mt-6">Loading convert orders...</p>
        ) : error ? (
          <div className="mt-6 flex items-center justify-between gap-3 text-red-400">
            <p>{error}</p>
            <button className="button-ghost text-xs" onClick={retryFetch}>
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-6 table-wrap scrollbar-hide max-h-[70vh] overflow-y-auto">
            <table className="table-base">
              <thead className="table-head sticky top-0 z-20 bg-slate-900/80 backdrop-blur">
                <tr>
                  <th className="px-3 py-2 whitespace-nowrap">No.</th>
                  {TABLE_COLUMNS.map((column) => (
                    <th key={column.key} className="px-3 py-2 whitespace-nowrap">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr className="table-row">
                    <td
                      className="px-3 py-3 whitespace-nowrap"
                      colSpan={TABLE_COLUMNS.length + 2}
                    >
                      No convert orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={getActionId(order) || `convert-row-${index}`}
                      className="table-row"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
                      {TABLE_COLUMNS.map((column) => (
                        <td
                          key={`${getActionId(order)}-${column.key}`}
                          className="px-3 py-2 whitespace-nowrap"
                        >
                          {formatValue(order[column.key])}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="button-ghost text-xs"
                            onClick={() => openEditModal(order)}
                            disabled={actionLoading}
                          >
                            Edit
                          </button>
                          <button
                            className="button-ghost text-xs text-rose-300"
                            onClick={() => handleDelete(order)}
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-xl modal-panel p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Dialog.Title className="text-lg font-semibold text-white">
                      Edit Convert Order
                    </Dialog.Title>
                    <button
                      type="button"
                      className="button-ghost text-xs"
                      onClick={closeEditModal}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {EDITABLE_KEYS.map((key) => (
                      <div key={key} className={key === 'payload' ? 'sm:col-span-2' : ''}>
                        <label className="mb-1 block text-xs text-slate-300">
                          {formatLabel(key)}
                        </label>
                        {key === 'payload' ? (
                          <textarea
                            rows={6}
                            className="input-dark w-full text-xs"
                            value={editForm[key] ?? ''}
                            onChange={(event) =>
                              setEditForm((prev) => ({
                                ...prev,
                                [key]: event.target.value,
                              }))
                            }
                          />
                        ) : (
                          <input
                            type="text"
                            className="input-dark w-full text-xs"
                            value={editForm[key] ?? ''}
                            onChange={(event) =>
                              setEditForm((prev) => ({
                                ...prev,
                                [key]: event.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {actionError && (
                    <p className="mt-3 text-sm text-rose-300">{actionError}</p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="button-ghost text-xs"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button-primary text-xs"
                      onClick={handleEditSave}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ConvertOrdersPage;
