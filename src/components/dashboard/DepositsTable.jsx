import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDeposits,
  setSelectedDeposit,
  setDepositModalType,
} from '../../slices/depositSlice';
import DepositsManager from '../modals/DepositManager';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  fetchAdminDeposits,
  approveDeposit,
  disapproveDeposit,
  deleteAdminDeposit,
} from '../../redux/thunks/depositsThunk';
import { showPromise } from '../../utils/toast';

const dummyDeposits = [
  {
    id: 1,
    userName: 'fname lname',
    amountValue: '0.0052796264543191',
    amount: '545455',
    transactionMethod: 'bitcoin',
    userID: '46a5ad400018e84a66adefac8273608d',
    wallet: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    transactionIdentifier: '#K4O9dRTn1v',
    userBalance: '1017273',
    transactionStatus: 'Pending',
    date: '5/15/2025, 11:03:11 PM',
  },
  {
    id: 2,
    userName: 'fname lname',
    amountValue: '0.86133477856922',
    amount: '89000',
    transactionMethod: 'bitcoin',
    userID: '46a5ad400018e84a66adefac8273608d',
    wallet: 'furghugwnurngugugrggg',
    transactionIdentifier: '#7KtvLAGsVP',
    userBalance: '1025860',
    transactionStatus: 'Pending',
    date: '5/13/2025, 3:15:33 PM',
  },
];

const DepositsTable = () => {
  const dispatch = useDispatch();
  const { deposits } = useSelector((state) => state.deposits);
  const hasFetchedRef = useRef(false);
  const [search, setSearch] = React.useState('');

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    const loadDeposits = async () => {
      const result = await dispatch(fetchAdminDeposits());
      if (fetchAdminDeposits.fulfilled.match(result)) {
        dispatch(setDeposits(result.payload || []));
      }
    };
    loadDeposits();
  }, [dispatch]);

  const handleModal = (deposit, type) => {
    dispatch(setSelectedDeposit(deposit));
    dispatch(setDepositModalType(type));
  };

  const runDepositAction = (actionThunk, successMsg) => {
    const promise = new Promise((resolve, reject) => {
      dispatch(actionThunk)
        .unwrap()
        .then((res) => {
          dispatch(fetchAdminDeposits());
          resolve(res);
        })
        .catch((err) => reject(err));
    });

    showPromise(promise, {
      loading: `${successMsg}...`,
      success: successMsg,
      error: (msg) => msg?.message || msg || `Failed to ${successMsg.toLowerCase()}`,
    });
  };

  const handleDelete = (id) => {
    runDepositAction(deleteAdminDeposit(id), 'Deposit deleted');
  };

  const modalActions = [{ label: 'Edit Deposit Details', type: 'edit' }];

  const directActions = [
    { label: 'Delete Deposit', action: (id) => handleDelete(id) },
    {
      label: 'Disapprove Deposit',
      action: (id) =>
        runDepositAction(
          disapproveDeposit({ depositId: id, actionDate: new Date().toISOString() }),
          'Deposit disapproved'
        ),
    },
    {
      label: 'Approve Deposit',
      action: (id) =>
        runDepositAction(
          approveDeposit({ depositId: id, actionDate: new Date().toISOString() }),
          'Deposit approved'
        ),
    },
  ];

  const filteredDeposits = deposits.filter((dep) =>
    Object.values(dep).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="mt-6 panel panel-pad">
      <h2 className="text-xl font-semibold text-white mb-4">All Deposits</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search deposits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark md:max-w-sm"
        />
      </div>
      <div className="table-wrap scrollbar-hide">
        <table className="table-base">
          <thead className="table-head">
            <tr>
              <th className="px-3 py-2 whitespace-nowrap">#</th>
              {Object.keys(deposits[0] || {})
                .filter((k) => k !== 'id')
                .map((key, idx) => (
                  <th
                    key={idx}
                    className="px-3 py-2 whitespace-nowrap capitalize"
                  >
                    {key}
                  </th>
                ))}
              <th className="px-3 py-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeposits.map((dep, idx) => (
              <tr key={dep.id} className="table-row">
                <td className="px-3 py-2">{idx + 1}</td>
                {Object.keys(dep)
                  .filter((k) => k !== 'id')
                  .map((key, i) => (
                    <td key={i} className="px-3 py-2 whitespace-nowrap">
                      {dep[key]}
                    </td>
                  ))}
                <td className="px-3 py-2 relative z-50">
                  <Popover className="relative z-50">
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
                        className="fixed top-[57%] left-[43%] lg:left-[83%] transform -translate-x-1/2 -translate-y-1/2 z-50 menu-panel"
                      >
                        {({ close }) => (
                          <>
                            <p className="muted-text text-xs mb-1">Open Modals</p>
                            {modalActions.map(({ label, type }) => (
                              <button
                                key={type}
                                onClick={() => {
                                  handleModal(dep, type);
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
                                  action(dep.id);
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

      <DepositsManager />
    </div>
  );
};

export default DepositsTable;
