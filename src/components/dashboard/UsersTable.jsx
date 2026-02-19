import { Dialog, Popover, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUsers,
  setSelectedUser,
  setModalType,
} from '../../slices/userSlice';
import { fetchUsers } from '../../slices/fetchSlice';
import ModalsManager from '../modals/ModalsManager';
import {
  deleteUser,
  disableUserLogin,
  enableUserLogin,
  disableAlertMessage,
  enableAlertMessage,
  disableKyc,
  enableKyc,
  resendVerificationEmail,
  disableOtpLogin,
  enableOtpLogin,
  disableUserTrade,
  enableUserTrade,
  disableUserDeposit,
  enableUserDeposit,
  disableUserWithdrawal,
  enableUserWithdrawal,
  logoutUserSession,
  updateUserBalances,
} from '../../redux/thunks/usersThunk';
import { showPromise } from '../../utils/toast';

const userColumns = [
  // { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'password', label: 'Password' },
  { key: 'referral', label: 'Referral' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'language', label: 'Language' },
  { key: 'BasicVerification', label: 'Basic Verification' },
  { key: 'AdvancedVerification', label: 'Advanced Verification' },
  { key: 'InstitutionalVerification', label: 'Institutional Verification' },
  { key: 'identityNumber', label: 'Identity Number' },
  { key: 'antiPhishingCode', label: 'Anti-Phishing Code' },
  { key: 'withdrawalSecurity', label: 'Withdrawal Security' },
  { key: 'uid', label: 'UID' },
  { key: 'currency', label: 'Currency' },
  { key: 'verifyUser', label: 'Verify User' },
  { key: 'UserLogin', label: 'User Login' },
  { key: 'AllowLogin', label: 'Allow Login' },
  { key: 'emailVerication', label: 'Email Verification' },
  { key: 'totalAsset', label: 'Total Asset' },
  { key: 'spotAccount', label: 'Spot Account' },
  { key: 'futureAccount', label: 'Future Account' },
  { key: 'earnAccount', label: 'Earn Account' },
  { key: 'copyAccount', label: 'Copy Account' },
  { key: 'ipAdress', label: 'IP Address' },
  { key: 'referralBonus', label: 'Referral Bonus' },
  { key: 'Message', label: 'Message' },
  { key: 'allowMessage', label: 'Allow Message' },
  { key: 'image', label: 'Image' },
  { key: 'accToken', label: 'Access Token' },
  { key: 'lockCopy', label: 'Lock Copy' },
  { key: 'lockKey', label: 'Lock Key' },
  { key: 'alert', label: 'Alert' },
  { key: 'sendKyc', label: 'Send KYC' },
  { key: 'SignalMessage', label: 'Signal Message' },
  { key: 'kyc', label: 'KYC' },
  { key: 'encryptedPassword', label: 'Encrypted Password' },
  { key: 'tokenExpiry', label: 'Token Expiry' },
  { key: 'refreshToken', label: 'Refresh Token' },
  { key: 'userAgent', label: 'User Agent' },
  { key: 'deviceType', label: 'Device Type' },
  { key: 'lastLogin', label: 'Last Login' },
  { key: 'tokenRevoked', label: 'Token Revoked' },
  { key: 'allowOtp', label: 'Allow OTP' },
  { key: 'totp_secret', label: 'TOTP Secret' },
  { key: 'balances_json', label: 'Crypto Balances' },
  { key: 'isGoogleAUthEnabled', label: 'Google Auth' },
];

const USERS_PER_PAGE = 20;

const UsersTable = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { fetchedUsers } = useSelector((state) => state.data);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [balanceModalUser, setBalanceModalUser] = useState(null);
  const [editableBalances, setEditableBalances] = useState([]);
  const [editableBalanceIds, setEditableBalanceIds] = useState(new Set());
  const [coinSearch, setCoinSearch] = useState('');
  const [coinPage, setCoinPage] = useState(1);
  const COINS_PER_PAGE = 20;

  useEffect(() => {
    const nextUsers = fetchedUsers?.userDetails || fetchedUsers || [];
    dispatch(setUsers(nextUsers));
  }, [dispatch, fetchedUsers]);

  // console.log(fetchedUsers);
  //   useEffect(() => {
  //     dispatch(fetchUsers());
  //   }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const parseBalances = (balancesJson) => {
    if (!balancesJson) return [];
    if (Array.isArray(balancesJson)) return balancesJson;
    if (typeof balancesJson === 'object') {
      return Array.isArray(balancesJson?.balances) ? balancesJson.balances : [];
    }
    try {
      const parsed = JSON.parse(balancesJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getBalancesSource = (user) => user?.balances_json ?? null;

  const openBalancesModal = (user) => {
    const balances = parseBalances(getBalancesSource(user)).map((item) => ({
      ...item,
      balance: Number(item.balance || 0),
      price: Number(item.price || 0),
    }));
    setBalanceModalUser(user);
    setEditableBalances(balances);
    setEditableBalanceIds(new Set());
    setCoinSearch('');
    setCoinPage(1);
  };

  const closeBalancesModal = () => {
    setBalanceModalUser(null);
    setEditableBalances([]);
    setEditableBalanceIds(new Set());
    setCoinSearch('');
    setCoinPage(1);
  };

  const handleSaveBalances = () => {
    if (!balanceModalUser?.accToken) return;
    const balances_json = JSON.stringify(
      editableBalances.map((b) => ({
        id: b.id,
        balance: Number(b.balance || 0),
        price: Number(b.price || 0),
      }))
    );

    const promise = new Promise((resolve, reject) => {
      dispatch(
        updateUserBalances({
          accToken: balanceModalUser.accToken,
          balances_json,
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(fetchUsers());
          resolve(res);
        })
        .catch((err) => reject(err));
    });

    showPromise(promise, {
      loading: 'Updating crypto balances...',
      success: () => 'Crypto balances updated',
      error: (msg) => msg?.message || msg || 'Failed to update balances',
    });

    closeBalancesModal();
  };

  const getBalanceSummary = (balancesJson) => {
    const balances = parseBalances(balancesJson);
    const totalValue = balances.reduce((sum, item) => {
      const balance = Number(item?.balance || 0);
      const price = Number(item?.price || 0);
      return sum + balance * price;
    }, 0);
    const preview = balances
      .slice(0, 3)
      .map((item) => `${item.id}:${item.balance}`)
      .join(', ');
    const suffix = balances.length > 3 ? ` +${balances.length - 3} more` : '';
    return {
      count: balances.length,
      totalValue,
      preview: preview ? `${preview}${suffix}` : '-',
    };
  };

  const handleModal = (user, type) => {
    dispatch(setSelectedUser(user));
    dispatch(setModalType(type));
  };

  const modalActions = [
    { label: 'Edit User', type: 'edit' },
    { label: 'Change Signal Message', type: 'signal' },
    { label: 'Fund User', type: 'fund' },
    { label: 'Add Profit', type: 'profit' },
    { label: 'Add Loss', type: 'loss' },
  ];

  const directActions = [
    { label: 'Delete User', action: deleteUser },
    { label: 'Disable User Login', action: disableUserLogin },
    { label: 'Enable User Login', action: enableUserLogin },
    { label: 'Disable User Trade', action: disableUserTrade },
    { label: 'Enable User Trade', action: enableUserTrade },
    { label: 'Disable User Deposit', action: disableUserDeposit },
    { label: 'Enable User Deposit', action: enableUserDeposit },
    { label: 'Disable User Withdrawal', action: disableUserWithdrawal },
    { label: 'Enable User Withdrawal', action: enableUserWithdrawal },
    { label: 'Logout User Session', action: logoutUserSession },
    { label: 'Disable Alert Message', action: disableAlertMessage },
    { label: 'Enable Alert Message', action: enableAlertMessage },
    { label: 'Disable Kyc', action: disableKyc },
    { label: 'Enable Kyc', action: enableKyc },
    { label: 'Resend Verification Email', action: resendVerificationEmail },
    { label: 'Enable OTP Login', action: enableOtpLogin },
    { label: 'Disable OTP Login', action: disableOtpLogin },
  ];

  const handleDirectActionClick = (label, user, action) => {
    const promise = new Promise((resolve, reject) => {
      dispatch(action(user.accToken))
        .unwrap()
        .then((res) => {
          const status = res?.status;
          const okStatus = typeof status === 'number' && status >= 200 && status < 300;
          const okPrimitive =
            typeof res === 'string' || typeof res === 'number' || res === true;
          if (okStatus || okPrimitive) {
            setTimeout(() => {
              dispatch(fetchUsers());
              resolve(res);
            }, 2000);
          } else {
            setTimeout(() => reject(`${label} failed`), 2000);
          }
        })
        .catch((err) => {
          setTimeout(
            () => reject(err?.response?.data?.errors || `${label} failed`),
            2000
          );
        });
    });

    showPromise(promise, {
      loading: `${label} in progress...`,
      success: (msg) => msg?.data?.message || `${label} successful`,
      error: (msg) => msg || `${label} failed`,
    });
  };

  const getValueByPath = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  const filtered = users.filter((user) => {
    const baseValues = Object.values(user);
    const balancesText = parseBalances(getBalancesSource(user))
      .map((item) => `${item.id} ${item.balance} ${item.price}`)
      .join(' ');
    return [...baseValues, balancesText].some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const getSortableValue = (user, column) => {
    if (column === 'balances_json') {
      return getBalanceSummary(user.balances_json).totalValue;
    }
    return getValueByPath(user, column) ?? '';
  };

  const sortedUsers = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = getSortableValue(a, sortColumn);
    const valB = getSortableValue(b, sortColumn);

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    return sortDirection === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);

  return (
    <div className="mt-6 panel panel-pad">
      <h2 className="text-xl font-semibold text-white mb-4">
        Every Action for Each User
      </h2>

      {/* Search & Sorting Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="search for a user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark md:max-w-sm"
        />

        <div className="flex items-center gap-3">
          <select
            value={sortColumn || ''}
            onChange={(e) => setSortColumn(e.target.value || null)}
            className="select-dark"
          >
            <option value="">Sort by</option>
            {userColumns.map((col) => (
              <option key={col.key} value={col.key}>
                {col.label}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
            className="button-ghost"
          >
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <div className="table-wrap scrollbar-hide">
        <table className="table-base">
          <thead className="table-head">
            <tr>
              <th className="px-3 py-2 whitespace-nowrap capitalize">#</th>
              {userColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 whitespace-nowrap capitalize"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, idx) => (
              <tr key={idx} className="table-row">
                <td className="px-3 py-2 whitespace-nowrap">
                  {(currentPage - 1) * USERS_PER_PAGE + idx + 1}
                </td>
                {userColumns.map((col) => {
                  if (col.key === 'balances_json') {
                    return (
                      <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                        <button
                          className="button-ghost text-xs"
                          onClick={() => openBalancesModal(user)}
                        >
                          View Crypto Balance
                        </button>
                      </td>
                    );
                  }
                  return (
                    <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                      {user[col.key] || '-'}
                    </td>
                  );
                })}
                <td className="px-3 py-2 relative z-10">
                  <Popover className="relative z-10">
                    <Popover.Button className="icon-button">
                      <i className="bi bi-three-dots-vertical" />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Popover.Panel
                        static
                        className="fixed top-[50%] left-[43%] lg:left-[83%] transform -translate-x-1/2 -translate-y-1/2 z-50 menu-panel"
                      >
                        {({ close }) => (
                          <>
                            <p className="muted-text text-xs mb-1">
                              Open Modals
                            </p>
                            {modalActions.map(({ label, type }) => (
                              <button
                                key={type}
                                onClick={() => {
                                  handleModal(user, type);
                                  close();
                                }}
                                className="w-full text-left px-2 py-1 hover:bg-[#151c26] rounded"
                              >
                                {label}
                              </button>
                            ))}

                            <hr className="border-[color:var(--color-stroke)] my-2" />
                            <p className="muted-text text-xs mb-1">
                              Direct Actions
                            </p>
                            {directActions.map(({ label, action }, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  handleDirectActionClick(label, user, action);
                                  close();
                                }}
                                className="w-full text-left px-2 py-1 hover:bg-[#151c26] rounded"
                              >
                                {label}
                              </button>
                            ))}
                          </>
                        )}
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-3 items-center mt-4 text-white">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_12px_#a3e635] transition-all duration-300 hover:scale-105"
        >
          <i className="bi bi-chevron-left" />
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_12px_#a3e635] transition-all duration-300 hover:scale-105"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <ModalsManager />

      <Transition appear show={!!balanceModalUser} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeBalancesModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl modal-panel p-6 transition-all">
                  <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
                    <Dialog.Title className="text-lg font-semibold">
                      Edit Crypto Balances
                    </Dialog.Title>
                    <div className="flex items-center gap-2">
                      <div className="sidebar-search">
                        <i className="bi bi-search text-sm" />
                        <input
                          placeholder="Search coin"
                          value={coinSearch}
                          onChange={(e) => {
                            setCoinSearch(e.target.value);
                            setCoinPage(1);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const normalized = coinSearch.trim().toLowerCase();
                    const sortedBalances = [...editableBalances].sort((a, b) =>
                      String(a.id || '').localeCompare(String(b.id || ''))
                    );
                    const filteredBalances = normalized
                      ? sortedBalances.filter((bal) =>
                          String(bal.id || '')
                            .toLowerCase()
                            .includes(normalized)
                        )
                      : sortedBalances;
                    const totalCoinPages = Math.max(
                      1,
                      Math.ceil(filteredBalances.length / COINS_PER_PAGE)
                    );
                    const page = Math.min(coinPage, totalCoinPages);
                    const paginatedBalances = filteredBalances.slice(
                      (page - 1) * COINS_PER_PAGE,
                      page * COINS_PER_PAGE
                    );
                    return (
                      <>
                        <div className="table-wrap scrollbar-hide mb-4">
                          <table className="table-base">
                            <thead className="table-head">
                              <tr>
                                <th className="px-3 py-2">Coin</th>
                                <th className="px-3 py-2">Balance</th>
                                <th className="px-3 py-2">Price</th>
                                <th className="px-3 py-2 text-right">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedBalances.length === 0 && (
                                <tr className="table-row">
                                  <td
                                    className="px-3 py-6 text-center muted-text"
                                    colSpan={4}
                                  >
                                    No balances available
                                  </td>
                                </tr>
                              )}
                              {paginatedBalances.map((bal, index) => {
                                const absoluteIndex =
                                  (page - 1) * COINS_PER_PAGE + index;
                                return (
                                  <tr
                                    key={bal.id || index}
                                    className="table-row"
                                  >
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      {bal.id}
                                    </td>
                                    <td className="px-3 py-2">
                                      {editableBalanceIds.has(bal.id) ? (
                                        <input
                                          type="number"
                                          className="input-dark text-sm w-30"
                                          value={bal.balance}
                                          onChange={(e) => {
                                            const next = [...editableBalances];
                                            next[absoluteIndex] = {
                                              ...next[absoluteIndex],
                                              balance: e.target.value,
                                            };
                                            setEditableBalances(next);
                                          }}
                                        />
                                      ) : (
                                        <span className="text-sm">
                                          {Number(bal.balance).toFixed(4)}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2">
                                      {editableBalanceIds.has(bal.id) ? (
                                        <input
                                          type="number"
                                          className="input-dark text-sm w-30"
                                          value={bal.price}
                                          onChange={(e) => {
                                            const next = [...editableBalances];
                                            next[absoluteIndex] = {
                                              ...next[absoluteIndex],
                                              price: e.target.value,
                                            };
                                            setEditableBalances(next);
                                          }}
                                        />
                                      ) : (
                                        <span className="text-sm">
                                          {Number(bal.price).toFixed(4)}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      <button
                                        className="button-ghost text-xs"
                                        onClick={() => {
                                          const next = new Set(
                                            editableBalanceIds
                                          );
                                          if (next.has(bal.id)) {
                                            next.delete(bal.id);
                                          } else {
                                            next.add(bal.id);
                                          }
                                          setEditableBalanceIds(next);
                                        }}
                                      >
                                        {editableBalanceIds.has(bal.id)
                                          ? 'Done'
                                          : 'Edit'}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-200">
                          <span>
                            Page {page} of {totalCoinPages}
                          </span>
                          <div className="flex gap-5">
                            <button
                              className="button-ghost text-xs"
                              disabled={page === 1}
                              onClick={() =>
                                setCoinPage((p) => Math.max(1, p - 1))
                              }
                            >
                              <i className="bi bi-chevron-left" />
                            </button>
                            <button
                              className="button-ghost text-xs"
                              disabled={page === totalCoinPages}
                              onClick={() =>
                                setCoinPage((p) =>
                                  Math.min(totalCoinPages, p + 1)
                                )
                              }
                            >
                              <i className="bi bi-chevron-right" />
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className="flex justify-end mt-4 gap-5">
                    <button
                      onClick={closeBalancesModal}
                      className="button-ghost text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBalances}
                      className="button-primary text-sm"
                    >
                      Save Changes
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

export default UsersTable;
