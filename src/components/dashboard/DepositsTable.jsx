import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeposits,
  setSelectedDeposit,
  setDepositModalType,
  deleteDeposit,
} from "../../slices/depositSlice";
import DepositsManager from "../modals/DepositManager";
import { Popover, Transition } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";
import { Fragment } from "react";

const dummyDeposits = [
  {
    id: 1,
    userName: "fname lname",
    amountValue: "0.0052796264543191",
    amount: "545455",
    transactionMethod: "bitcoin",
    userID: "46a5ad400018e84a66adefac8273608d",
    wallet: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    transactionIdentifier: "#K4O9dRTn1v",
    userBalance: "1017273",
    transactionStatus: "Pending",
    date: "5/15/2025, 11:03:11 PM",
  },
  {
    id: 2,
    userName: "fname lname",
    amountValue: "0.86133477856922",
    amount: "89000",
    transactionMethod: "bitcoin",
    userID: "46a5ad400018e84a66adefac8273608d",
    wallet: "furghugwnurngugugrggg",
    transactionIdentifier: "#7KtvLAGsVP",
    userBalance: "1025860",
    transactionStatus: "Pending",
    date: "5/13/2025, 3:15:33 PM",
  },
];

const DepositsTable = () => {
  const dispatch = useDispatch();
  const { deposits } = useSelector((state) => state.deposits);

  useEffect(() => {
    dispatch(setDeposits(dummyDeposits));
  }, [dispatch]);

  const handleModal = (deposit, type) => {
    dispatch(setSelectedDeposit(deposit));
    dispatch(setDepositModalType(type));
  };

  const handleDelete = (id) => {
    dispatch(deleteDeposit(id));
  };

  const modalActions = [{ label: "Edit Deposit Details", type: "edit" }];

  const directActions = [
    { label: "Delete Deposit", action: (id) => handleDelete(id) },
    {
      label: "Disapprove Deposit",
      action: (id) => console.log("Disapprove", id),
    },
    { label: "Approve Deposit", action: (id) => console.log("Approve", id) },
  ];

  return (
    <div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
      <h2 className='text-xl font-semibold text-white mb-4'>All Deposits</h2>
      <div className='overflow-x-auto rounded-xl scrollbar-hide'>
        <table className='table-auto text-sm text-left text-white w-full'>
          <thead className='bg-[#121212] text-gray-300'>
            <tr>
              <th className='px-3 py-2 whitespace-nowrap'>#</th>
              {Object.keys(deposits[0] || {})
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
            {deposits.map((dep, idx) => (
              <tr
                key={dep.id}
                className='border-b border-gray-800 hover:bg-[#2a2a2a]'
              >
                <td className='px-3 py-2'>{idx + 1}</td>
                {Object.keys(dep)
                  .filter((k) => k !== "id")
                  .map((key, i) => (
                    <td key={i} className='px-3 py-2 whitespace-nowrap'>
                      {dep[key]}
                    </td>
                  ))}
                <td className='px-3 py-2 relative z-50'>
                  <Popover className='relative z-50'>
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
                        className='fixed top-[57%] left-[43%] lg:left-[83%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#111] text-white shadow-md rounded-md border border-gray-700 p-2 w-64 space-y-1 text-sm'
                      >
                        <p className='text-gray-400 text-xs mb-1'>
                          Open Modals
                        </p>
                        {modalActions.map(({ label, type }) => (
                          <button
                            key={type}
                            onClick={() => handleModal(dep, type)}
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
                            onClick={() => action(dep.id)}
                            className='w-full text-left px-2 py-1 hover:bg-[#222] rounded'
                          >
                            {label}
                          </button>
                        ))}
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
