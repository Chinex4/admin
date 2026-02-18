import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteReferral,
  fetchReferrals,
  updateReferral,
} from '../../redux/thunks/referralThunk';
import {
  selectReferralActionError,
  selectReferralActionLoading,
  selectReferrals,
  selectReferralsError,
  selectReferralsLoading,
} from '../../selectors/referralSelectors';
import { clearReferralActionError } from '../../slices/referralSlice';
import { showError, showSuccess } from '../../utils/toast';

const TABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'nameOfRefers', label: 'Name of Referrers' },
  { key: 'referrerId', label: 'Referrer ID' },
  { key: 'referredId', label: 'Referred ID' },
  { key: 'referralId', label: 'Referral ID' },
  { key: 'dateOfReferral', label: 'Date of Referral' },
  { key: 'amtEarned', label: 'Amount Earned' },
  { key: 'status', label: 'Status' },
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

const normalizeReferral = (item = {}, index = 0) => ({
  id: item?.id ?? item?.referralId ?? `row-${index}`,
  nameOfRefers: item?.nameOfRefers ?? '',
  referrerId: item?.referrerId ?? '',
  referredId: item?.referredId ?? '',
  referralId: item?.referralId ?? '',
  dateOfReferral: item?.dateOfReferral ?? '',
  amtEarned: item?.amtEarned ?? '',
  status: item?.status ?? '',
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

const parseEditValue = (value) => String(value ?? '').trim();

const getActionId = (item) => {
  const value = item?.id ?? item?.referralId;
  return value === null || value === undefined ? '' : String(value).trim();
};

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

const ReferralsPage = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectReferrals);
  const loading = useSelector(selectReferralsLoading);
  const error = useSelector(selectReferralsError);
  const actionLoading = useSelector(selectReferralActionLoading);
  const actionError = useSelector(selectReferralActionError);

  const [search, setSearch] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [editForm, setEditForm] = useState({});

  const referrals = useMemo(
    () => list.map((item, index) => normalizeReferral(item, index)),
    [list]
  );

  const filteredReferrals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return referrals;
    return referrals.filter((item) =>
      TABLE_COLUMNS.some((column) =>
        String(formatValue(item[column.key])).toLowerCase().includes(query)
      )
    );
  }, [referrals, search]);

  useEffect(() => {
    dispatch(fetchReferrals())
      .unwrap()
      .catch((err) =>
        showError(
          typeof err === 'string' ? err : 'Failed to fetch referral records'
        )
      );
  }, [dispatch]);

  const retryFetch = () => {
    dispatch(fetchReferrals())
      .unwrap()
      .catch((err) =>
        showError(
          typeof err === 'string' ? err : 'Failed to fetch referral records'
        )
      );
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedReferral(null);
    setEditForm({});
  };

  const openEditModal = (item) => {
    if (!item) return;
    dispatch(clearReferralActionError());
    setSelectedReferral(item);
    const initialForm = EDITABLE_KEYS.reduce((acc, key) => {
      acc[key] = toInputString(item[key]);
      return acc;
    }, {});
    setEditForm(initialForm);
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedReferral) return;
    const actionId = getActionId(selectedReferral);
    if (!actionId) {
      showError('Referral identifier is missing');
      return;
    }
    dispatch(clearReferralActionError());
    try {
      const payload = Object.entries(editForm).reduce((acc, [key, value]) => {
        acc[key] = parseEditValue(value);
        return acc;
      }, {});
      await dispatch(updateReferral({ id: actionId, payload })).unwrap();
      showSuccess('Referral record updated');
      closeEditModal();
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to update referral record'
      );
    }
  };

  const handleDelete = async (item) => {
    const actionId = getActionId(item);
    if (!actionId) {
      showError('Referral identifier is missing');
      return;
    }
    if (!window.confirm(`Delete referral ${actionId}?`)) return;
    dispatch(clearReferralActionError());
    try {
      await dispatch(deleteReferral(actionId)).unwrap();
      showSuccess('Referral record deleted');
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to delete referral record'
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="panel panel-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-white">Referral Table</h2>
          <input
            type="text"
            placeholder="Search referral records..."
            className="input-dark w-full lg:max-w-md"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="muted-text mt-6">Loading referral records...</p>
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
                {filteredReferrals.length === 0 ? (
                  <tr className="table-row">
                    <td
                      className="px-3 py-3 whitespace-nowrap"
                      colSpan={TABLE_COLUMNS.length + 2}
                    >
                      No referral records found.
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map((item, index) => (
                    <tr
                      key={getActionId(item) || `referral-row-${index}`}
                      className="table-row"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
                      {TABLE_COLUMNS.map((column) => (
                        <td
                          key={`${getActionId(item)}-${column.key}`}
                          className="px-3 py-2 whitespace-nowrap"
                        >
                          {formatValue(item[column.key])}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="button-ghost text-xs"
                            onClick={() => openEditModal(item)}
                            disabled={actionLoading}
                          >
                            Edit
                          </button>
                          <button
                            className="button-ghost text-xs text-rose-300"
                            onClick={() => handleDelete(item)}
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
                      Edit Referral
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
                      <div key={key}>
                        <label className="mb-1 block text-xs text-slate-300">
                          {formatLabel(key)}
                        </label>
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

export default ReferralsPage;
