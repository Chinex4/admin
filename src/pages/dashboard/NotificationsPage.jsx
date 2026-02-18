import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
  updateNotification,
} from '../../redux/thunks/notificationThunk';
import {
  selectNotificationActionError,
  selectNotificationActionLoading,
  selectNotifications,
  selectNotificationsError,
  selectNotificationsLoading,
} from '../../selectors/notificationSelectors';
import { clearNotificationActionError } from '../../slices/notificationSlice';
import { showError, showSuccess } from '../../utils/toast';

const TABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'body', label: 'Body' },
  { key: 'createdAt', label: 'Created At' },
];

const normalizeNotification = (item = {}, index = 0) => ({
  id: item?.id ?? item?.notificationId ?? `row-${index}`,
  title: item?.title ?? '',
  body: item?.body ?? '',
  createdAt: item?.createdAt ?? '',
});

const formatValue = (value) => {
  if (value === null || value === undefined) return '-';
  const stringValue = String(value).trim();
  return stringValue === '' ? '-' : stringValue;
};

const getActionId = (item) => {
  const value = item?.id ?? item?.notificationId;
  return value === null || value === undefined ? '' : String(value).trim();
};

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);
  const actionLoading = useSelector(selectNotificationActionLoading);
  const actionError = useSelector(selectNotificationActionError);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [form, setForm] = useState({ title: '', body: '' });

  const notifications = useMemo(
    () => list.map((item, index) => normalizeNotification(item, index)),
    [list]
  );

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notifications;
    return notifications.filter((item) =>
      [item.title, item.body, item.createdAt].join(' ').toLowerCase().includes(query)
    );
  }, [notifications, search]);

  useEffect(() => {
    dispatch(fetchNotifications())
      .unwrap()
      .catch((err) =>
        showError(typeof err === 'string' ? err : 'Failed to fetch notifications')
      );
  }, [dispatch]);

  const retryFetch = () => {
    dispatch(fetchNotifications())
      .unwrap()
      .catch((err) =>
        showError(typeof err === 'string' ? err : 'Failed to fetch notifications')
      );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
    setForm({ title: '', body: '' });
  };

  const openCreateModal = () => {
    dispatch(clearNotificationActionError());
    setMode('create');
    setSelectedNotification(null);
    setForm({ title: '', body: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    if (!item) return;
    dispatch(clearNotificationActionError());
    setMode('edit');
    setSelectedNotification(item);
    setForm({
      title: String(item.title ?? ''),
      body: String(item.body ?? ''),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: String(form.title ?? '').trim(),
      body: String(form.body ?? '').trim(),
    };
    if (!payload.title || !payload.body) {
      showError('Title and body are required');
      return;
    }
    dispatch(clearNotificationActionError());
    try {
      if (mode === 'create') {
        await dispatch(createNotification(payload)).unwrap();
        showSuccess('Notification created');
        closeModal();
        dispatch(fetchNotifications());
        return;
      }
      const actionId = getActionId(selectedNotification);
      if (!actionId) {
        showError('Notification identifier is missing');
        return;
      }
      await dispatch(updateNotification({ id: actionId, payload })).unwrap();
      showSuccess('Notification updated');
      closeModal();
    } catch (err) {
      showError(
        typeof err === 'string'
          ? err
          : mode === 'create'
            ? 'Failed to create notification'
            : 'Failed to update notification'
      );
    }
  };

  const handleDelete = async (item) => {
    const actionId = getActionId(item);
    if (!actionId) {
      showError('Notification identifier is missing');
      return;
    }
    if (!window.confirm(`Delete notification ${actionId}?`)) return;
    dispatch(clearNotificationActionError());
    try {
      await dispatch(deleteNotification(actionId)).unwrap();
      showSuccess('Notification deleted');
    } catch (err) {
      showError(typeof err === 'string' ? err : 'Failed to delete notification');
    }
  };

  return (
    <div className="space-y-5">
      <div className="panel panel-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          <div className="flex w-full gap-2 lg:w-auto">
            <input
              type="text"
              placeholder="Search notifications..."
              className="input-dark w-full lg:w-80"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="button-primary text-xs" onClick={openCreateModal}>
              Create Notification
            </button>
          </div>
        </div>

        {loading ? (
          <p className="muted-text mt-6">Loading notifications...</p>
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
                {filteredNotifications.length === 0 ? (
                  <tr className="table-row">
                    <td
                      className="px-3 py-3 whitespace-nowrap"
                      colSpan={TABLE_COLUMNS.length + 2}
                    >
                      No notifications found.
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((item, index) => (
                    <tr
                      key={getActionId(item) || `notification-row-${index}`}
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-2xl rounded-xl modal-panel p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Dialog.Title className="text-lg font-semibold text-white">
                      {mode === 'create' ? 'Create Notification' : 'Edit Notification'}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="button-ghost text-xs"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-slate-300">Title</label>
                      <input
                        type="text"
                        className="input-dark w-full text-xs"
                        value={form.title}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, title: event.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-300">Body</label>
                      <textarea
                        rows={6}
                        className="input-dark w-full text-xs"
                        value={form.body}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, body: event.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {actionError && (
                    <p className="mt-3 text-sm text-rose-300">{actionError}</p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="button-ghost text-xs"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button-primary text-xs"
                      onClick={handleSave}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? mode === 'create'
                          ? 'Creating...'
                          : 'Saving...'
                        : mode === 'create'
                          ? 'Create'
                          : 'Save Changes'}
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

export default NotificationsPage;
