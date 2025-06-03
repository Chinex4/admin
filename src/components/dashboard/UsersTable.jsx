import { Popover, Transition } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsers,
  setSelectedUser,
  setModalType,
} from "../../slices/userSlice";
import ModalsManager from "../modals/ModalsManager";

const dummyUsers = [
  {
    id: 1,
    firstName: "Henry",
    lastName: "Richard",
    username: "rickemzy5",
    email: "erscod3@gmail.com",
    password: "Lolwaswas5_",
    phone: "13453454353",
    address: "OPPOSITE coinoil",
    city: "Abraka",
    zip: "383611",
    identityNumber: "455455",
    dob: "2022-11-05",
    currency: "$",
    experience: "not-much",
    employment: "unemployed",
    country: "El Salvador",
    state: "San Vicente Department",
    createdAt: "2025-05-21T15:30:44.756Z",
    verified: "False",
    userId: "#1HluzM3YD",
    login: "True",
    allowLogin: "enabled",
    emailVerified: "False",
    balance: "0.00",
    profit: "0.00",
    deposited: "0.00",
    withdrawn: "0.00",
    status: "Pending",
    ip: "192.168.8.184",
    plan: "Message",
    crypto: {
      BTC: "0.00",
      ETH: "0.00",
      USDT: "0.00",
      XRP: "0.00",
      BNB: "0.00",
      SOL: "0.00",
      DOGE: "0.00",
      USDC: "0.00",
      LDO: "0.00",
      ADA: "0.00",
      TRX: "0.00",
      AVAX: "0.00",
      LINK: "0.00",
      WETC: "0.00",
      TON: "0.00",
      SUI: "0.00",
      WBTC: "0.00",
      SHIB: "0.00",
      XLM: "0.00",
      DOT: "0.00",
      DJT: "0.00",
    },
    lock: "Locked",
    lockKey: "FVB456397874HM",
    signalMsg: "",
  },
  {
    id: 2,
    firstName: "fname",
    lastName: "lname",
    username: "erscode",
    email: "concyan@chefalicious.com",
    password: "Lolwaswas5_",
    phone: "18765434545455",
    address: "543434434344",
    city: "345453535",
    zip: "63345345",
    identityNumber: "455455",
    dob: "2022-05-03",
    currency: "€",
    experience: "intermediate",
    employment: "unemployed",
    country: "Jamaica",
    state: "Portland Parish",
    createdAt: "2025-05-08T14:30:49.023Z",
    verified: "True",
    userId: "#pr6y2tZwcv",
    login: "True",
    allowLogin: "enabled",
    emailVerified: "True",
    balance: "1009658",
    profit: "698887",
    deposited: "446902",
    withdrawn: "0.00",
    status: "Pending",
    ip: "192.168.8.184",
    plan: "Message",
    crypto: {
      BTC: "426298",
      ETH: "222400",
      USDT: "6000",
      XRP: "222400",
      BNB: "2000",
      SOL: "2000",
      DOGE: "2000",
      USDC: "2000",
      LDO: "2000",
      ADA: "2000",
      TRX: "51990",
      AVAX: "2000",
      LINK: "2000",
      WETC: "2000",
      TON: "2000",
      SUI: "0.00",
      WBTC: "2000",
      SHIB: "2000",
      XLM: "139736",
      DOT: "2000",
      DJT: "2000",
    },
    lock: "Unlocked",
    lockKey: "BTB888999139YT",
    signalMsg: "this is a message from i am doing what they call modifying",
  },
];

const UsersTable = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(setUsers(dummyUsers));
  }, [dispatch]);

  const filtered = users.filter((user) =>
    Object.values(user).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const topLevelKeys = Object.keys(users[0] || {}).filter(
    (k) => k !== "crypto"
  );
  const cryptoKeys = Object.keys(users[0]?.crypto || {});

  const handleModal = (user, type) => {
    dispatch(setSelectedUser(user));
    dispatch(setModalType(type));
  };

  const modalActions = [
    { label: "Edit User", type: "edit" },
    { label: "Change Signal Message", type: "signal" },
    { label: "Fund User", type: "fund" },
    { label: "Add Profit", type: "profit" },
    { label: "Add Loss", type: "loss" },
  ];

  const directActions = [
    "Delete User",
    "Disable User Login",
    "Enable User Login",
    "Disable Alert Message",
    "Enable Alert Message",
    "Disable Kyc",
    "Enable Kyc",
    "Resend Verification Email",
  ];

  return (
    <div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
      <h2 className='text-xl font-semibold text-white mb-4'>
        Every Action for Each User
      </h2>

      <input
        type='text'
        placeholder='search for a user'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
      />

      <div className='overflow-x-auto rounded-xl scrollbar-hide'>
        <table className='table-auto text-sm text-left text-white w-full'>
          <thead className='bg-[#121212] text-gray-300'>
            <tr>
              {[...topLevelKeys, ...cryptoKeys, "Actions"].map((key, idx) => (
                <th
                  key={idx}
                  className='px-3 py-2 whitespace-nowrap capitalize'
                >
                  {key === "signalMsg" ?
                    "Signal"
                  : key === "lockKey" ?
                    "Lock Key"
                  : key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, idx) => (
              <tr
                key={idx}
                className='border-b border-gray-800 hover:bg-[#2a2a2a]'
              >
                {topLevelKeys.map((key, i) => (
                  <td key={i} className='px-3 py-2 whitespace-nowrap'>
                    {user[key] || "-"}
                  </td>
                ))}
                {cryptoKeys.map((coin, i) => (
                  <td key={i} className='px-3 py-2 whitespace-nowrap'>
                    {user.crypto[coin] || "0.00"}
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
                        className='fixed top-[50%] left-[43%] lg:left-[83%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#111] text-white shadow-lg border border-gray-700 rounded-md p-2 w-64 space-y-1'
                      >
                        <p className='text-gray-400 text-xs mb-1'>
                          Open Modals
                        </p>
                        {modalActions.map(({ label, type }) => (
                          <button
                            key={type}
                            onClick={() => handleModal(user, type)}
                            className='w-full text-left px-2 py-1 hover:bg-[#222] rounded'
                          >
                            {label}
                          </button>
                        ))}
                        <hr className='border-gray-700 my-2' />
                        <p className='text-gray-400 text-xs mb-1'>
                          Direct Actions
                        </p>
                        {directActions.map((label, i) => (
                          <button
                            key={i}
                            onClick={() => console.log(`${label} on`, user)}
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

      <ModalsManager />
    </div>
  );
};

export default UsersTable;
