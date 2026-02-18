import React, { useEffect, useMemo, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { showError, showSuccess } from "../../utils/toast";
import {
  clearTradeActionError,
  setTrades,
  setSelectedTrade,
  setTradeModalType,
} from "../../slices/tradeSlice";
import TradeModalsManager from "../modals/TradeModalManager";
import { Popover, Transition } from "@headlessui/react";
import { deleteTradeOrder } from "../../redux/thunks/tradeActionsThunk";

const toStringOrDash = (value) => {
  if (value === null || value === undefined) return "-";
  const str = String(value).trim();
  return str ? str : "-";
};

const normalizeAlias = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const findValue = (obj, aliases) => {
  if (!obj || typeof obj !== "object") return undefined;

  for (const alias of aliases) {
    const direct = obj?.[alias];
    if (direct !== undefined && direct !== null && String(direct).trim() !== "") {
      return direct;
    }
  }

  const keys = Object.keys(obj);
  for (const alias of aliases) {
    const target = normalizeAlias(alias);
    const matched = keys.find((key) => normalizeAlias(key) === target);
    if (!matched) continue;
    const value = obj[matched];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return undefined;
};

const parseJsonSafely = (value) => {
  if (!value || typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const pick = (sources, aliases, fallback = "") => {
  for (const source of sources) {
    const value = findValue(source, aliases);
    if (value !== undefined) return value;
  }
  return fallback;
};

const normalizeTrade = (trade = {}, index = 0) => {
  const rawRequest = parseJsonSafely(trade?.rawRequest);
  const sources = [trade, rawRequest, rawRequest?.meta];

  return {
    id: pick(sources, ["id", "_id", "tradeId"], `trade-${index}`),
    orderId: pick(sources, ["orderId", "order_id", "orderid", "id"], ""),
    clientOrderId: pick(sources, ["clientOrderId", "client_order_id", "clientorderid"], ""),
    userId: pick(sources, ["userId", "user_id", "userid"], ""),
    symbol: pick(sources, ["symbol", "pair", "coinPair"], ""),
    baseAsset: pick(sources, ["baseAsset", "base_asset", "coin"], ""),
    quoteAsset: pick(sources, ["quoteAsset", "quote_asset", "feeAsset", "fee_asset"], ""),
    side: pick(sources, ["side"], ""),
    action: pick(sources, ["action", "type"], ""),
    type: pick(sources, ["type"], ""),
    orderType: pick(sources, ["orderType", "order_type"], ""),
    timeInForce: pick(sources, ["timeInForce", "time_in_force"], ""),
    status: pick(sources, ["status", "transStatus"], ""),
    payout: pick(sources, ["payout", "pnl"], ""),
    price: pick(sources, ["price"], ""),
    quantity: pick(sources, ["quantity", "amount"], ""),
    quoteOrderQty: pick(sources, ["quoteOrderQty", "quote_order_qty"], ""),
    orderValue: pick(sources, ["orderValue", "order_value", "total"], ""),
    feePaid: pick(sources, ["feePaid", "fee_paid", "fee"], ""),
    feeAsset: pick(sources, ["feeAsset", "fee_asset"], ""),
    reduceOnly: pick(sources, ["reduceOnly", "reduce_only"], ""),
    postOnly: pick(sources, ["postOnly", "post_only"], ""),
    leverage: pick(sources, ["leverage"], ""),
    marginMode: pick(sources, ["marginMode", "margin_mode"], ""),
    positionSide: pick(sources, ["positionSide", "position_side"], ""),
    stopPrice: pick(sources, ["stopPrice", "stop_price"], ""),
    takeProfitPrice: pick(sources, ["takeProfitPrice", "take_profit_price"], ""),
    stopLossPrice: pick(sources, ["stopLossPrice", "stop_loss_price"], ""),
    source: pick(sources, ["source"], ""),
    submittedAt: pick(sources, ["submittedAt", "submitted_at", "time", "timestamp"], ""),
    entryPrice: pick(sources, ["entryPrice", "entry_price", "openPrice"], ""),
    createdAt: pick(sources, ["createdAt", "date", "created_at"], ""),
    updatedAt: pick(sources, ["updatedAt", "updated_at"], ""),
    market: pick(sources, ["market"], "futures"),
  };
};

const columns = [
  "orderId",
  "clientOrderId",
  "userId",
  "symbol",
  "baseAsset",
  "quoteAsset",
  "side",
  "action",
  "type",
  "orderType",
  "timeInForce",
  "status",
  "payout",
  "price",
  "quantity",
  "quoteOrderQty",
  "orderValue",
  "feePaid",
  "feeAsset",
  "reduceOnly",
  "postOnly",
  "leverage",
  "marginMode",
  "positionSide",
  "stopPrice",
  "takeProfitPrice",
  "stopLossPrice",
  "source",
  "submittedAt",
  "entryPrice",
  "createdAt",
  "updatedAt",
  "market",
];

const defaultVisibleColumns = ["orderId", "symbol", "status", "createdAt"];

const TradeTable = () => {
  const dispatch = useDispatch();
  const { trades } = useSelector((state) => state.trades);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFuturesTrades = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.get("admin/futuresTrades");
        const payload = res?.data?.message ?? res?.data ?? [];
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.transactions)
            ? payload.transactions
            : Array.isArray(res?.data?.transactions)
              ? res.data.transactions
              : [];
        const normalized = list
          .map((item, index) => normalizeTrade(item, index))
          .filter((item) => String(item.market).toLowerCase() === "futures");

        if (isMounted) {
          dispatch(setTrades(normalized));
        }
      } catch (err) {
        console.error("Failed to fetch futures trades:", err);
        const message = "Failed to fetch futures trades";
        if (isMounted) {
          setError(message);
          dispatch(setTrades([]));
        }
        showError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFuturesTrades();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const filtered = useMemo(
    () =>
      trades.filter((trade) =>
        columns.some((key) =>
          String(trade?.[key] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      ),
    [trades, search]
  );

  const visibleColumns = useMemo(() => {
    if (filtered.length <= 1) return columns;

    const dynamic = columns.filter((column) => {
      const unique = new Set(
        filtered.map((trade) => {
          const value = trade?.[column];
          return value === null || value === undefined || String(value).trim() === ""
            ? "__EMPTY__"
            : String(value).trim().toLowerCase();
        })
      );
      return unique.size > 1;
    });

    if (dynamic.length > 0) return dynamic;

    return defaultVisibleColumns.filter((column) => columns.includes(column));
  }, [filtered]);

  const handleModal = (trade, type) => {
    dispatch(clearTradeActionError());
    dispatch(setSelectedTrade(trade));
    dispatch(setTradeModalType(type));
  };

  const handleDeleteTrade = async (trade) => {
    const tradeId = trade?.orderId ?? trade?.id;
    if (!tradeId) {
      showError("Trade identifier is missing");
      return;
    }
    if (!window.confirm(`Delete trade ${tradeId}?`)) return;
    try {
      await dispatch(deleteTradeOrder(tradeId)).unwrap();
      showSuccess("Trade deleted");
    } catch (err) {
      showError(typeof err === "string" ? err : "Failed to delete trade");
    }
  };

  const modalActions = [
    { label: "Edit Trade Details", type: "edit" },
    { label: "Win Trade", type: "win" },
    { label: "Lose Trade", type: "loss" },
  ];

  const directActions = [
    {
      label: "Delete Trade",
      action: (trade) => handleDeleteTrade(trade),
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
              {visibleColumns.map((key) => (
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
                <td className='px-3 py-3' colSpan={visibleColumns.length + 2}>
                  Loading futures trades...
                </td>
              </tr>
            ) : error ? (
              <tr className='table-row'>
                <td className='px-3 py-3 text-red-400' colSpan={visibleColumns.length + 2}>
                  {error}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr className='table-row'>
                <td className='px-3 py-3' colSpan={visibleColumns.length + 2}>
                  No futures trades found.
                </td>
              </tr>
            ) : (
              filtered.map((trade, idx) => (
              <tr
                key={trade.id}
                className='table-row'
              >
                <td className='px-3 py-2'>{idx + 1}</td>
                {visibleColumns.map((key) => (
                  <td key={`${trade.id}-${key}`} className='px-3 py-2 whitespace-nowrap'>
                    {toStringOrDash(trade[key])}
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
                              onClick={() => action(trade)}
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
              ))
            )}
          </tbody>
        </table>
      </div>
      <TradeModalsManager />
    </div>
  );
};

export default TradeTable;




