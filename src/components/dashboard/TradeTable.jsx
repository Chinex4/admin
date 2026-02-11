import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTrades,
  deleteTrade,
  setSelectedTrade,
  setTradeModalType,
} from "../../slices/tradeSlice";
import TradeModalsManager from "../modals/TradeModalManager";
import { Popover, Transition } from "@headlessui/react";

const dummyTrades = [
  {
    id: 1,
    userName: "fname lname",
    amount: "232",
    symbol: "USD/CHF",
    interval: "60 sec",
    leverage: "0.5X",
    stopLoss: "323",
    takeProfit: "323",
    entryPrice: "323",
    tradeType: "sell",
    pairs: "Forex Pairs",
    transId: "#uYiUPrZ2Ek",
    transStatus: "Pending",
    date: "5/20/2025, 10:30:21 PM",
    outcome: "",
  },
];

const TradeTable = () => {
  const dispatch = useDispatch();
  const { trades } = useSelector((state) => state.trades);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(setTrades(dummyTrades));
  }, [dispatch]);

  const filtered = trades.filter((t) =>
    Object.values(t).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleModal = (trade, type) => {
    dispatch(setSelectedTrade(trade));
    dispatch(setTradeModalType(type));
  };

  const modalActions = [
    { label: "Win Trade", type: "win" },
    { label: "Lose Trade", type: "loss" },
  ];

  const directActions = [
    {
      label: "Delete Trade",
      action: (id) => dispatch(deleteTrade(id)),
    },
  ];

  return (
    <div className='mt-6 panel panel-pad'>
      <h2 className='text-xl font-semibold text-white mb-4'>All Trades</h2>
      <input
        type='text'
        placeholder='Search trades...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='input-dark mb-4'
      />
      <div className='table-wrap scrollbar-hide'>
        <table className='table-base'>
          <thead className='table-head'>
            <tr>
              <th className='px-3 py-2'>#</th>
              {Object.keys(dummyTrades[0])
                .filter((k) => k !== "id")
                .map((key, idx) => (
                  <th
                    key={idx}
                    className='px-3 py-2 whitespace-nowrap capitalize'
                  >
                    {key}
                  </th>
                ))}
              <th className='px-3 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trade, idx) => (
              <tr
                key={trade.id}
                className='table-row'
              >
                <td className='px-3 py-2'>{idx + 1}</td>
                {Object.keys(trade)
                  .filter((k) => k !== "id")
                  .map((key, i) => (
                    <td key={i} className='px-3 py-2 whitespace-nowrap'>
                      {trade[key]}
                    </td>
                  ))}
                <td className='px-3 py-2 relative z-50'>
                  <Popover className='relative z-50'>
                    <>
                      <Popover.Button className='icon-button'>
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
                          <p className='muted-text text-xs mb-1'>
                            Open Modals
                          </p>
                          {modalActions.map(({ label, type }) => (
                            <button
                              key={type}
                              onClick={() => handleModal(trade, type)}
                              className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded'
                            >
                              {label}
                            </button>
                          ))}
                          <hr className='border-[color:var(--color-stroke)] my-2' />
                          <p className='muted-text text-xs mb-1'>
                            Direct Actions
                          </p>
                          {directActions.map(({ label, action }, i) => (
                            <button
                              key={i}
                              onClick={() => action(trade.id)}
                              className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded'
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
      <TradeModalsManager />
    </div>
  );
};

export default TradeTable;




