import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { showError, showSuccess } from '../../utils/toast';
import { Dialog, Popover, Transition } from '@headlessui/react';

const columns = [
  'earningId',
  'tradeOrderId',
  'orderId',
  'userId',
  'amount',
  'account',
  'entryType',
  'status',
  'market',
  'symbol',
  'createdAt',
  'updatedAt',
];

const editableFields = [
  'tradeOrderId',
  'orderId',
  'userId',
  'amount',
  'account',
  'entryType',
  'status',
  'market',
  'symbol',
];

const toStringOrDash = (value) => {
  if (value === null || value === undefined) return '-';
  const text = String(value).trim();
  return text ? text : '-';
};

const normalizeRow = (row = {}, index = 0) => ({
  id: row?.id ?? `earning-${index}`,
  earningId: row?.earningId ?? '',
  tradeOrderId: row?.tradeOrderId ?? '',
  orderId: row?.orderId ?? '',
  userId: row?.userId ?? '',
  amount: row?.amount ?? '',
  account: row?.account ?? '',
  entryType: row?.entryType ?? '',
  status: row?.status ?? '',
  market: row?.market ?? '',
  symbol: row?.symbol ?? '',
  createdAt: row?.createdAt ?? '',
  updatedAt: row?.updatedAt ?? '',
});

const TradeEarningsTable = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingRow, setDeletingRow] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTradeEarnings = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axiosInstance.get('admin/tradeEarnings');
        const payload = res?.data?.message ?? res?.data ?? [];
        const list = Array.isArray(payload) ? payload : [];
        const normalized = list.map((item, index) => normalizeRow(item, index));
        if (isMounted) {
          setRows(normalized);
        }
      } catch {
        if (isMounted) {
          setRows([]);
          setError('Failed to fetch trade earnings');
        }
        showError('Failed to fetch trade earnings');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTradeEarnings();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        columns.some((key) =>
          String(row?.[key] ?? '')
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      ),
    [rows, search]
  );

  const openEdit = (row) => {
    setEditingRow(row);
    const form = {};
    editableFields.forEach((field) => {
      form[field] = row?.[field] ?? '';
    });
    setEditForm(form);
  };

  const closeEdit = () => {
    setEditingRow(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    const targetId = editingRow?.earningId || editingRow?.id;
    if (!targetId) {
      showError('Trade earning identifier is missing');
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(editForm).map(([key, value]) => [key, String(value ?? '').trim()])
    );
    payload.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      setActionLoading(true);
      const res = await axiosInstance.put(`admin/tradeEarnings/${targetId}`, payload);
      const messagePayload = res?.data?.message ?? {};
      const incomingRaw = messagePayload?.earning ?? messagePayload;
      const incoming = incomingRaw && typeof incomingRaw === 'object'
        ? normalizeRow(incomingRaw)
        : null;

      setRows((prev) =>
        prev.map((item) => {
          const isTarget =
            String(item?.id) === String(targetId) ||
            String(item?.earningId) === String(targetId) ||
            String(item?.id) === String(editingRow?.id) ||
            String(item?.earningId) === String(editingRow?.earningId);
          if (!isTarget) return item;
          return {
            ...item,
            ...payload,
            ...(incoming || {}),
          };
        })
      );
      closeEdit();
      showSuccess('Trade earning updated');
    } catch (err) {
      const message =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to update trade earning';
      showError(String(message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (row) => {
    const targetId = row?.earningId || row?.id;
    if (!targetId) {
      showError('Trade earning identifier is missing');
      return;
    }

    try {
      setActionLoading(true);
      await axiosInstance.delete(`admin/tradeEarnings/${targetId}`);
      setRows((prev) =>
        prev.filter(
          (item) =>
            String(item?.id) !== String(targetId) &&
            String(item?.earningId) !== String(targetId)
        )
      );
      showSuccess('Trade earning deleted');
    } catch (err) {
      const message =
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to delete trade earning';
      showError(String(message));
    } finally {
      setActionLoading(false);
      setDeletingRow(null);
    }
  };

  return (
    <div className='mt-6 panel panel-pad'>
      <h2 className='text-xl font-semibold text-white mb-4'>Trade Earnings</h2>
      <input
        type='text'
        placeholder='Search earnings...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='input-dark mb-4'
      />

      <div className='table-wrap scrollbar-hide'>
        <table className='table-base'>
          <thead className='table-head'>
            <tr>
              <th className='px-3 py-2'>#</th>
              {columns.map((key) => (
                <th key={key} className='px-3 py-2 whitespace-nowrap capitalize'>
                  {key}
                </th>
              ))}
              <th className='px-3 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className='table-row'>
                <td className='px-3 py-3' colSpan={columns.length + 2}>
                  Loading trade earnings...
                </td>
              </tr>
            ) : error ? (
              <tr className='table-row'>
                <td className='px-3 py-3 text-red-400' colSpan={columns.length + 2}>
                  {error}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr className='table-row'>
                <td className='px-3 py-3' colSpan={columns.length + 2}>
                  No trade earnings found.
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => (
                <tr key={`${row.id}-${row.earningId}`} className='table-row'>
                  <td className='px-3 py-2'>{index + 1}</td>
                  {columns.map((key) => (
                    <td key={`${row.id}-${key}`} className='px-3 py-2 whitespace-nowrap'>
                      {toStringOrDash(row[key])}
                    </td>
                  ))}
                  <td className='px-3 py-2 relative z-50'>
                    <Popover className='relative z-50'>
                      <>
                        <Popover.Button className='icon-button' disabled={actionLoading}>
                          <i className='bi bi-three-dots-vertical' />
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-200'
                          enterFrom='opacity-0 scale-95'
                          enterTo='opacity-100 scale-100'
                          leave='transition ease-in duration-150'
                          leaveFrom='opacity-100 scale-100'
                          leaveTo='opacity-0 scale-95'
                        >
                          <Popover.Panel
                            static
                            className='fixed top-[60%] left-[43%] lg:left-[85%] transform -translate-x-1/2 -translate-y-1/2 z-50 menu-panel'
                          >
                            <button
                              type='button'
                              onClick={() => openEdit(row)}
                              className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded'
                            >
                              Edit
                            </button>
                            <button
                              type='button'
                              onClick={() => setDeletingRow(row)}
                              className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded text-red-400'
                            >
                              Delete
                            </button>
                          </Popover.Panel>
                        </Transition>
                      </>
                    </Popover>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Transition appear show={Boolean(editingRow)} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={closeEdit}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            leave='ease-in duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-60' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                leave='ease-in duration-200'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='modal-panel w-full max-w-2xl rounded-xl p-6'>
                  <Dialog.Title className='text-lg font-semibold mb-4'>Edit Trade Earning</Dialog.Title>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {editableFields.map((field) => (
                      <div key={field} className='space-y-1'>
                        <label className='text-xs text-slate-300 capitalize'>{field}</label>
                        <input
                          type='text'
                          className='input-dark w-full'
                          value={editForm[field] ?? ''}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              [field]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className='mt-6 flex justify-end gap-2'>
                    <button
                      type='button'
                      onClick={closeEdit}
                      className='bg-red-600 px-4 py-2 rounded text-sm'
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={handleSaveEdit}
                      className='bg-green-600 px-4 py-2 rounded text-sm'
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={Boolean(deletingRow)} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={() => setDeletingRow(null)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            leave='ease-in duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-60' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                leave='ease-in duration-200'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='modal-panel w-full max-w-md rounded-xl p-6'>
                  <Dialog.Title className='text-lg font-semibold mb-2'>Delete Trade Earning</Dialog.Title>
                  <p className='text-sm text-slate-300 mb-6'>
                    Delete trade earning {deletingRow?.earningId || deletingRow?.id}?
                  </p>
                  <div className='flex justify-end gap-2'>
                    <button
                      type='button'
                      onClick={() => setDeletingRow(null)}
                      className='bg-slate-600 px-4 py-2 rounded text-sm'
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(deletingRow)}
                      className='bg-red-600 px-4 py-2 rounded text-sm'
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Deleting...' : 'Delete'}
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

export default TradeEarningsTable;
