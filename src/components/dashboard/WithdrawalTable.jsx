import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setWithdrawals,
  setSelectedWithdraw,
  setWithdrawModalType,
  deleteWithdraw,
} from "../../slices/withdrawSlice";
import WithdrawManager from "../modals/WithdrawalManager";
import { Popover, Transition } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";

const dummyWithdrawals = [
  {
    id: 1,
    userName: "fname lname",
    amount: "€3466",
    withdrawalMethod: "Polkadot",
    wallet: "44fffecd38g0g4f4fui4jfp89j4[j9jf9jofj43f4",
    withdrawalIdentifier: "#IcaAhjHg1N",
    withdrawalStatus: "Approved",
    date: "5/12/2025, 2:32:41 PM",
  },
];

const WithdrawTable = () => {
  const dispatch = useDispatch();
  const { withdrawals } = useSelector((state) => state.withdrawals);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(setWithdrawals(dummyWithdrawals));
  }, [dispatch]);

  const filtered = withdrawals.filter((w) =>
    Object.values(w).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleModal = (withdraw, type) => {
    dispatch(setSelectedWithdraw(withdraw));
    dispatch(setWithdrawModalType(type));
  };

  const modalActions = [{ label: "Edit Withdrawal Details", type: "edit" }];

  const directActions = [
    {
      label: "Delete Withdrawal",
      action: (id) => dispatch(deleteWithdraw(id)),
    },
    {
      label: "Disapprove Withdrawal",
      action: (id) => console.log("Disapprove", id),
    },
    { label: "Approve Withdrawal", action: (id) => console.log("Approve", id) },
  ];

  return (
    <div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
      <h2 className='text-xl font-semibold text-white mb-4'>All Withdrawals</h2>
      <input
        type='text'
        placeholder='Search withdrawal...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
      />

      <div className='overflow-x-auto rounded-xl scrollbar-hide'>
        <table className='table-auto text-sm text-left text-white w-full'>
          <thead className='bg-[#121212] text-gray-300'>
            <tr>
              <th className='px-3 py-2 whitespace-nowrap'>#</th>
              {Object.keys(dummyWithdrawals[0])
                .filter((k) => k !== "id")
                .map((key, idx) => (
                  <th
                    key={idx}
                    className='px-3 py-2 whitespace-nowrap capitalize'
                  >
                    {key}
                  </th>
                ))}
              <th className='px-3 py-2 whitespace-nowrap'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((withdraw, idx) => (
              <tr
                key={withdraw.id}
                className='border-b border-gray-800 hover:bg-[#2a2a2a]'
              >
                <td className='px-3 py-2'>{idx + 1}</td>
                {Object.keys(withdraw)
                  .filter((k) => k !== "id")
                  .map((key, i) => (
                    <td key={i} className='px-3 py-2 whitespace-nowrap'>
                      {withdraw[key]}
                    </td>
                  ))}
                <td className='px-3 py-2 relative z-50'>
                  <Popover className='relative z-50'>
                    <>
                      <Popover.Button className='text-white hover:text-gray-300'>
                        <EllipsisVertical className='w-5 h-5' />
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
                          className='fixed top-[60%] left-[43%] lg:left-[85%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#111] text-white shadow-md rounded-md border border-gray-700 p-2 w-64 space-y-1 text-sm'
                        >
                          <p className='text-gray-400 text-xs mb-1'>
                            Open Modals
                          </p>
                          {modalActions.map(({ label, type }) => (
                            <button
                              key={type}
                              onClick={() => handleModal(withdraw, type)}
                              className='w-full text-left px-2 py-1 hover:bg-[#222] rounded'
                            >
                              {label}
                            </button>
                          ))}
                          <hr className='border-gray-700 my-2' />
                          <p className='text-gray-400 text-xs mb-1'>
                            Direct Actions
                          </p>
                          {directActions.map(({ label, action }, i) => (
                            <button
                              key={i}
                              onClick={() => action(withdraw.id)}
                              className='w-full text-left px-2 py-1 hover:bg-[#222] rounded'
                            >
                              {label}
                            </button>
                          ))}
                        </Popover.Panel>
                      </Transition>
                    </>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WithdrawManager />
    </div>
  );
};

export default WithdrawTable;
