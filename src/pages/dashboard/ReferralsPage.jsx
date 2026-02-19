import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCards from '../../components/dashboard/DashboardCards';
import {
  approveReferral,
  disapproveReferral,
  deleteReferral,
  fetchReferrals,
  updateReferral,
} from '../../redux/thunks/referralThunk';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
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
  { key: 'referralBonus', label: 'Referral Bonus' },
  { key: 'status', label: 'Status' },
  { key: 'inviterUserId', label: 'Inviter User ID' },
  { key: 'inviteeUserId', label: 'Invitee User ID' },
  { key: 'inviterAccToken', label: 'Inviter Acc Token' },
  { key: 'inviteeAccToken', label: 'Invitee Acc Token' },
  { key: 'inviteCodeUsed', label: 'Invite Code Used' },
  { key: 'inviteUrlUsed', label: 'Invite URL Used' },
  { key: 'rewardCurrency', label: 'Reward Currency' },
  { key: 'rewardedAt', label: 'Rewarded At' },
  { key: 'qualifiedAt', label: 'Qualified At' },
  { key: 'qualificationEvent', label: 'Qualification Event' },
];

const EDITABLE_KEYS = TABLE_COLUMNS.map((column) => column.key).filter(
  (key) => key !== 'id'
);

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

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
  id: item?.id ?? item?.referralId ?? item?.referral_id ?? `row-${index}`,
  nameOfRefers: item?.nameOfRefers ?? item?.name_of_refers ?? '',
  referrerId: item?.referrerId ?? item?.referrer_id ?? '',
  referredId: item?.referredId ?? item?.referred_id ?? '',
  referralId: item?.referralId ?? item?.referral_id ?? '',
  dateOfReferral: item?.dateOfReferral ?? item?.date_of_referral ?? '',
  amtEarned: item?.amtEarned ?? item?.amt_earned ?? '',
  referralBonus:
    item?.referralBonus ??
    item?.referral_bonus ??
    item?.bonus ??
    item?.inviter?.referralBonus ??
    item?.inviter?.referral_bonus ??
    item?.user?.referralBonus ??
    item?.user?.referral_bonus ??
    '',
  status: item?.status ?? '',
  inviterUserId: item?.inviterUserId ?? item?.inviter_user_id ?? '',
  inviteeUserId: item?.inviteeUserId ?? item?.invitee_user_id ?? '',
  inviterAccToken: item?.inviterAccToken ?? item?.inviter_acc_token ?? '',
  inviteeAccToken: item?.inviteeAccToken ?? item?.invitee_acc_token ?? '',
  inviteCodeUsed: item?.inviteCodeUsed ?? item?.invite_code_used ?? '',
  inviteUrlUsed: item?.inviteUrlUsed ?? item?.invite_url_used ?? '',
  rewardCurrency: item?.rewardCurrency ?? item?.reward_currency ?? '',
  rewardedAt: item?.rewardedAt ?? item?.rewarded_at ?? '',
  qualifiedAt: item?.qualifiedAt ?? item?.qualified_at ?? '',
  qualificationEvent:
    item?.qualificationEvent ?? item?.qualification_event ?? '',
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
  const value = item?.id ?? item?.referralId ?? item?.referral_id;
  return value === null || value === undefined ? '' : String(value).trim();
};

const isApprovedReferral = (item) => {
  const status = String(item?.status ?? '').trim().toLowerCase();
  return status === 'approved';
};

const isDisapprovedReferral = (item) => {
  const status = String(item?.status ?? '').trim().toLowerCase();
  return status === 'disapproved';
};

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

const normalizeSortValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value;
  const text = String(value).trim();
  if (text === '') return '';
  const numericText = text.replace(/,/g, '');
  if (/^-?\d+(\.\d+)?$/.test(numericText)) {
    const numericValue = Number(numericText);
    if (Number.isFinite(numericValue)) return numericValue;
  }
  const dateValue = Date.parse(text);
  if (!Number.isNaN(dateValue)) return dateValue;
  return text.toLowerCase();
};

const compareSortValues = (a, b, direction) => {
  const left = normalizeSortValue(a);
  const right = normalizeSortValue(b);

  let base = 0;
  if (typeof left === 'number' && typeof right === 'number') {
    base = left - right;
  } else {
    base = String(left).localeCompare(String(right), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  return direction === 'asc' ? base : -base;
};

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
  const [referralToDelete, setReferralToDelete] = useState(null);
  const [actionReferral, setActionReferral] = useState(null);
  const [approvalReferral, setApprovalReferral] = useState(null);
  const [approvalAmount, setApprovalAmount] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

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

  const sortedReferrals = useMemo(() => {
    const next = [...filteredReferrals];
    next.sort((a, b) => compareSortValues(a?.[sortBy], b?.[sortBy], sortDirection));
    return next;
  }, [filteredReferrals, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedReferrals.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedReferrals = useMemo(
    () => sortedReferrals.slice(startIndex, startIndex + pageSize),
    [sortedReferrals, startIndex, pageSize]
  );

  const referralCards = [
    {
      label: 'Total Referrals',
      value: loading ? '...' : referrals.length,
      icon: <i className="bi bi-people text-3xl" />,
    },
  ];

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, sortDirection, pageSize]);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

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

  const openDeleteModal = (item) => {
    const actionId = getActionId(item);
    if (!actionId) {
      showError('Referral identifier is missing');
      return;
    }
    dispatch(clearReferralActionError());
    setReferralToDelete(item);
  };

  const closeDeleteModal = () => {
    if (actionLoading) return;
    setReferralToDelete(null);
  };

  const openActionModal = (item) => {
    if (!item) return;
    setActionReferral(item);
  };

  const closeActionModal = () => {
    if (actionLoading) return;
    setActionReferral(null);
  };

  const handleActionEdit = () => {
    if (!actionReferral) return;
    const item = actionReferral;
    setActionReferral(null);
    openEditModal(item);
  };

  const handleActionDelete = () => {
    if (!actionReferral) return;
    const item = actionReferral;
    setActionReferral(null);
    openDeleteModal(item);
  };

  const openApproveModal = (item) => {
    if (!item) return;
    const actionId = getActionId(item);
    if (!actionId) {
      showError('Referral identifier is missing');
      return;
    }
    dispatch(clearReferralActionError());
    setApprovalReferral(item);
    setApprovalAmount(toInputString(item?.amtEarned));
    setActionReferral(null);
  };

  const closeApproveModal = () => {
    if (actionLoading) return;
    setApprovalReferral(null);
    setApprovalAmount('');
  };

  const handleActionApprove = () => {
    if (!actionReferral) return;
    openApproveModal(actionReferral);
  };

  const handleApproveSubmit = async () => {
    if (!approvalReferral) return;
    const actionId = getActionId(approvalReferral);
    if (!actionId) {
      showError('Referral identifier is missing');
      return;
    }
    const parsedAmount = Number(String(approvalAmount).trim());
    const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
    if (!hasValidAmount) {
      showError('Enter a valid amount greater than 0');
      return;
    }
    dispatch(clearReferralActionError());
    try {
      await dispatch(
        approveReferral({ id: actionId, amount: parsedAmount })
      ).unwrap();
      showSuccess('Referral approved and reward credited');
      closeApproveModal();
    } catch (err) {
      showError(typeof err === 'string' ? err : 'Failed to approve referral');
    }
  };

  const handleActionDisapprove = async () => {
    if (!actionReferral) return;
    const actionId = getActionId(actionReferral);
    if (!actionId) {
      showError('Referral identifier is missing');
      return;
    }
    dispatch(clearReferralActionError());
    try {
      await dispatch(disapproveReferral(actionId)).unwrap();
      showSuccess('Referral disapproved');
      setActionReferral(null);
    } catch (err) {
      showError(typeof err === 'string' ? err : 'Failed to disapprove referral');
    }
  };

  const confirmDelete = async () => {
    const actionId = getActionId(referralToDelete);
    if (!actionId) {
      showError('Referral identifier is missing');
      return;
    }
    dispatch(clearReferralActionError());
    try {
      await dispatch(deleteReferral(actionId)).unwrap();
      showSuccess('Referral record deleted');
      setReferralToDelete(null);
    } catch (err) {
      showError(
        typeof err === 'string' ? err : 'Failed to delete referral record'
      );
    }
  };

  return (
    <div className="space-y-5">
      <DashboardCards cardData={referralCards} centerSingleCard />

      <div className="panel panel-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-white">Referral Table</h2>
          <div className="grid w-full gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center">
            <input
              type="text"
              placeholder="Search referral records..."
              className="input-dark w-full lg:w-80"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="select-dark w-full lg:w-44"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {TABLE_COLUMNS.map((column) => (
                <option key={column.key} value={column.key}>
                  Sort: {column.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="button-ghost text-xs"
              onClick={() =>
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
            >
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>
            <select
              className="select-dark w-full lg:w-36"
              value={String(pageSize)}
              onChange={(event) => setPageSize(Number(event.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  Limit: {size}
                </option>
              ))}
            </select>
          </div>
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
          <>
            <div className="mt-6 table-wrap scrollbar-hide max-h-[70vh] overflow-y-auto">
            <table className="table-base">
              <thead className="table-head sticky top-0 z-20 bg-slate-900/80 backdrop-blur">
                <tr>
                  {TABLE_COLUMNS.map((column) => (
                    <th key={column.key} className="px-3 py-2 whitespace-nowrap">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedReferrals.length === 0 ? (
                  <tr className="table-row">
                    <td
                      className="px-3 py-3 whitespace-nowrap"
                      colSpan={TABLE_COLUMNS.length + 1}
                    >
                      No referral records found.
                    </td>
                  </tr>
                ) : (
                  paginatedReferrals.map((item, index) => (
                    <tr
                      key={getActionId(item) || `referral-row-${index}`}
                      className="table-row"
                    >
                      {TABLE_COLUMNS.map((column) => (
                        <td
                          key={`${getActionId(item)}-${column.key}`}
                          className="px-3 py-2 whitespace-nowrap"
                        >
                          {column.key === 'id'
                            ? startIndex + index + 1
                            : formatValue(item[column.key])}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="button-ghost text-xs px-2 py-1"
                            onClick={() => openActionModal(item)}
                            disabled={actionLoading}
                            aria-label="Open actions"
                          >
                            <i className="bi bi-three-dots-vertical" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>

            {sortedReferrals.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + pageSize, sortedReferrals.length)} of{' '}
                  {sortedReferrals.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="button-ghost text-xs"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={safeCurrentPage === 1}
                  >
                    Prev
                  </button>
                  <span>
                    Page {safeCurrentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="button-ghost text-xs"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
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

      <Transition appear show={Boolean(actionReferral)} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeActionModal}>
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
                <Dialog.Panel className="w-full max-w-sm rounded-xl modal-panel p-6">
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Referral Actions
                  </Dialog.Title>
                  <p className="mt-2 text-xs text-slate-300">
                    Choose an action for referral {getActionId(actionReferral)}.
                  </p>

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      className="button-primary w-full text-sm"
                      onClick={handleActionApprove}
                      disabled={actionLoading || isApprovedReferral(actionReferral)}
                    >
                      {isApprovedReferral(actionReferral)
                        ? 'Referral Approved'
                        : 'Approve Referral'}
                    </button>
                    <button
                      type="button"
                      className="button-ghost w-full text-sm border border-amber-300/40 text-amber-200"
                      onClick={handleActionDisapprove}
                      disabled={actionLoading || isDisapprovedReferral(actionReferral)}
                    >
                      {isDisapprovedReferral(actionReferral)
                        ? 'Referral Disapproved'
                        : 'Disapprove Referral'}
                    </button>
                    <button
                      type="button"
                      className="button-primary w-full text-sm"
                      onClick={handleActionEdit}
                      disabled={actionLoading}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-ghost w-full text-sm text-rose-300 border border-rose-300/40"
                      onClick={handleActionDelete}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="button-ghost w-full text-sm"
                      onClick={closeActionModal}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                  </div>
                  {actionError && (
                    <p className="mt-3 text-sm text-rose-300">{actionError}</p>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={Boolean(approvalReferral)} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeApproveModal}>
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
                <Dialog.Panel className="w-full max-w-sm rounded-xl modal-panel p-6">
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Approve Referral
                  </Dialog.Title>
                  <p className="mt-2 text-xs text-slate-300">
                    Enter the reward amount to add for referral{' '}
                    {getActionId(approvalReferral)}.
                  </p>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs text-slate-300">
                      Reward Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.00000001"
                      className="input-dark w-full text-sm"
                      value={approvalAmount}
                      onChange={(event) => setApprovalAmount(event.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>

                  {actionError && (
                    <p className="mt-3 text-sm text-rose-300">{actionError}</p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="button-ghost text-xs"
                      onClick={closeApproveModal}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button-primary text-xs"
                      onClick={handleApproveSubmit}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Approving...' : 'Approve Referral'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ConfirmDeleteModal
        isOpen={Boolean(referralToDelete)}
        title="Delete Referral"
        message={`Are you sure you want to delete referral ${getActionId(referralToDelete)}? This action cannot be undone.`}
        confirmLabel="Delete Referral"
        isLoading={actionLoading}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ReferralsPage;
