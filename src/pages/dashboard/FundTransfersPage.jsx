import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCards from '../../components/dashboard/DashboardCards';
import {
  deleteFundTransfer,
  fetchFundTransfers,
  updateFundTransfer,
} from '../../redux/thunks/fundTransferThunk';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import {
  selectFundTransferActionError,
  selectFundTransferActionLoading,
  selectFundTransfers,
  selectFundTransfersError,
  selectFundTransfersLoading,
} from '../../selectors/fundTransferSelectors';
import { clearFundTransferActionError } from '../../slices/fundTransferSlice';
import { showError, showSuccess } from '../../utils/toast';

const TABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'transferId', label: 'Transfer ID' },
  { key: 'userId', label: 'User ID' },
  { key: 'fromAccount', label: 'From Account' },
  { key: 'toAccount', label: 'To Account' },
  { key: 'asset', label: 'Asset' },
  { key: 'amount', label: 'Amount' },
  { key: 'amountUsd', label: 'Amount (USD)' },
  { key: 'coinQuantity', label: 'Coin Quantity' },
  { key: 'spotAccountBefore', label: 'Spot Account Before' },
  { key: 'spotAccountAfter', label: 'Spot Account After' },
  { key: 'futureAccountBefore', label: 'Future Account Before' },
  { key: 'futureAccountAfter', label: 'Future Account After' },
  { key: 'totalAssetAfter', label: 'Total Asset After' },
  { key: 'status', label: 'Status' },
  { key: 'rawRequest', label: 'Raw Request' },
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

const normalizeTransfer = (item = {}, index = 0) => ({
  id: item?.id ?? item?.transferId ?? `row-${index}`,
  transferId: item?.transferId ?? '',
  userId: item?.userId ?? '',
  fromAccount: item?.fromAccount ?? '',
  toAccount: item?.toAccount ?? '',
  asset: item?.asset ?? '',
  amount: item?.amount ?? '',
  amountUsd: item?.amountUsd ?? '',
  coinQuantity: item?.coinQuantity ?? '',
  spotAccountBefore: item?.spotAccountBefore ?? '',
  spotAccountAfter: item?.spotAccountAfter ?? '',
  futureAccountBefore: item?.futureAccountBefore ?? '',
  futureAccountAfter: item?.futureAccountAfter ?? '',
  totalAssetAfter: item?.totalAssetAfter ?? '',
  status: item?.status ?? '',
  rawRequest: item?.rawRequest ?? '',
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
  if (key === 'rawRequest') {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
};

const getActionId = (transfer) => {
  const value = transfer?.id ?? transfer?.transferId;
  return value === null || value === undefined ? '' : String(value).trim();
};

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

const FundTransfersPage = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectFundTransfers);
  const loading = useSelector(selectFundTransfersLoading);
  const error = useSelector(selectFundTransfersError);
  const actionLoading = useSelector(selectFundTransferActionLoading);
  const actionError = useSelector(selectFundTransferActionError);

  const [search, setSearch] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [transferToDelete, setTransferToDelete] = useState(null);

  const transfers = useMemo(
    () => list.map((item, index) => normalizeTransfer(item, index)),
    [list]
  );

  const filteredTransfers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transfers;
    return transfers.filter((transfer) =>
      TABLE_COLUMNS.some((column) =>
        String(formatValue(transfer[column.key])).toLowerCase().includes(query)
      )
    );
  }, [search, transfers]);

  const fundTransferCards = [
    {
      label: 'Total Fund Transfers',
      value: loading ? '...' : transfers.length,
      icon: <i className="bi bi-arrow-left-right text-3xl" />,
    },
  ];

  useEffect(() => {
    dispatch(fetchFundTransfers())
      .unwrap()
      .catch((err) =>
        showError(
          typeof err === 'string' ? err : 'Failed to fetch fund transfer records'
        )
      );
  }, [dispatch]);

  const retryFetch = () => {
    dispatch(fetchFundTransfers())
      .unwrap()
      .catch((err) =>
        showError(
          typeof err === 'string' ? err : 'Failed to fetch fund transfer records'
        )
      );
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedTransfer(null);
    setEditForm({});
  };

  const openEditModal = (transfer) => {
    if (!transfer) return;
    dispatch(clearFundTransferActionError());
    setSelectedTransfer(transfer);
    const initialForm = EDITABLE_KEYS.reduce((acc, key) => {
      acc[key] = toInputString(transfer[key]);
      return acc;
    }, {});
    setEditForm(initialForm);
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedTransfer) return;
    const actionId = getActionId(selectedTransfer);
    if (!actionId) {
      showError('Fund transfer identifier is missing');
      return;
    }
    dispatch(clearFundTransferActionError());
    try {
      const payload = Object.entries(editForm).reduce((acc, [key, value]) => {
        acc[key] = parseEditValue(key, value);
        return acc;
      }, {});
      await dispatch(updateFundTransfer({ id: actionId, payload })).unwrap();
      showSuccess('Fund transfer updated');
      closeEditModal();
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to update fund transfer record'
      );
    }
  };

  const openDeleteModal = (transfer) => {
    const actionId = getActionId(transfer);
    if (!actionId) {
      showError('Fund transfer identifier is missing');
      return;
    }
    dispatch(clearFundTransferActionError());
    setTransferToDelete(transfer);
  };

  const closeDeleteModal = () => {
    if (actionLoading) return;
    setTransferToDelete(null);
  };

  const confirmDelete = async () => {
    const actionId = getActionId(transferToDelete);
    if (!actionId) {
      showError('Fund transfer identifier is missing');
      return;
    }
    dispatch(clearFundTransferActionError());
    try {
      await dispatch(deleteFundTransfer(actionId)).unwrap();
      showSuccess('Fund transfer deleted');
      setTransferToDelete(null);
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to delete fund transfer record'
      );
    }
  };

  return (
    <div className="space-y-5">
      <DashboardCards cardData={fundTransferCards} centerSingleCard />

      <div className="panel panel-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-white">Fund Transfers</h2>
          <input
            type="text"
            placeholder="Search fund transfers..."
            className="input-dark w-full lg:max-w-md"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="muted-text mt-6">Loading fund transfer records...</p>
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
                {filteredTransfers.length === 0 ? (
                  <tr className="table-row">
                    <td
                      className="px-3 py-3 whitespace-nowrap"
                      colSpan={TABLE_COLUMNS.length + 2}
                    >
                      No fund transfer records found.
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((transfer, index) => (
                    <tr
                      key={getActionId(transfer) || `transfer-row-${index}`}
                      className="table-row"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
                      {TABLE_COLUMNS.map((column) => (
                        <td
                          key={`${getActionId(transfer)}-${column.key}`}
                          className="px-3 py-2 whitespace-nowrap"
                        >
                          {formatValue(transfer[column.key])}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="button-ghost text-xs"
                            onClick={() => openEditModal(transfer)}
                            disabled={actionLoading}
                          >
                            Edit
                          </button>
                          <button
                            className="button-ghost text-xs text-rose-300"
                            onClick={() => openDeleteModal(transfer)}
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
                      Edit Fund Transfer
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
                      <div key={key} className={key === 'rawRequest' ? 'sm:col-span-2' : ''}>
                        <label className="mb-1 block text-xs text-slate-300">
                          {formatLabel(key)}
                        </label>
                        {key === 'rawRequest' ? (
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

      <ConfirmDeleteModal
        isOpen={Boolean(transferToDelete)}
        title="Delete Fund Transfer"
        message={`Are you sure you want to delete fund transfer ${getActionId(transferToDelete)}? This action cannot be undone.`}
        confirmLabel="Delete Transfer"
        isLoading={actionLoading}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default FundTransfersPage;
