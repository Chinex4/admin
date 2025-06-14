import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWallets } from "../../slices/walletSlice";
import { deleteWallet } from "../../redux/thunks/walletsThunk";
import axiosInstance from "../../utils/axiosInstance";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { updateWallet } from "../../redux/thunks/walletsThunk";
import { showPromise, showSuccess } from "../../utils/toast";

const WalletsTable = () => {
  const dispatch = useDispatch();
  const { wallets } = useSelector((state) => state.wallets);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const itemsPerPage = 20;

  const columnKeys = [
    "coin_id",
    "symbol",
    "name",
    "network",
    "deposit_address",
    "min_deposit",
    "confirmations_required",
    "created_at",
  ];

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await axiosInstance.get("admin/fetchWallets");
        dispatch(setWallets(res?.data?.message));
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };
    fetchWallets();
  }, [dispatch]);

  const filtered =
    Array.isArray(wallets) ?
      wallets.filter((wallet) =>
        Object.values(wallet).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      )
    : [];

  const sorted = [...filtered].sort((a, b) => {
    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEdit = (wallet) => {
    const cleaned = Object.entries(wallet).reduce((acc, [key, value]) => {
      if (
        value !== null &&
        ![
          "network",
          "deposit_address",
          "min_deposit",
          "confirmations_required",
        ].includes(key)
      ) {
        acc[key] = value;
      }
      return acc;
    }, {});

    setSelectedWallet({
      ...cleaned,
      networks: Array.isArray(wallet.networks) ? wallet.networks : [],
    });
  };

  const closeModal = () => setSelectedWallet(null);

  const handleSave = async () => {
    try {
      await dispatch(updateWallet(selectedWallet)).unwrap();
      showSuccess("Wallet updated successfully");

      // Refetch wallets
      const res = await axiosInstance.get("admin/fetchWallets");
      dispatch(setWallets(res?.data?.message));

      closeModal();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (walletId) => {
  await showPromise(
    dispatch(deleteWallet(walletId)).unwrap(),
    {
      loading: 'Deleting wallet...',
      success: 'Wallet deleted successfully!',
      error: (err) =>
        typeof err === 'string'
          ? err
          : 'Failed to delete wallet. Please try again.',
    }
  );
};


  return (
    <div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
      <h2 className='text-xl font-semibold text-white mb-4'>User Wallets</h2>
      <input
        type='text'
        placeholder='Search wallets...'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
      />
      <div className='overflow-x-auto rounded-xl scrollbar-hide'>
        <table className='table-auto text-sm text-left text-white w-full'>
          <thead className='bg-[#121212] text-gray-300'>
            <tr>
              <th className='px-3 py-2'>#</th>
              {columnKeys.map((key) => (
                <th
                  key={key}
                  className='px-3 py-2 whitespace-nowrap cursor-pointer select-none'
                  onClick={() => handleSort(key)}
                >
                  <div className='flex items-center gap-1'>
                    {key}
                    {sortConfig.key === key ?
                      sortConfig.direction === "asc" ?
                        <ChevronUp size={14} />
                      : <ChevronDown size={14} />
                    : null}
                  </div>
                </th>
              ))}
              <th className='px-3 py-2'>Action</th>
            </tr>
          </thead>
   <tbody>
  {paginated.map((wallet, idx) => (
    <tr key={wallet.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
      <td className="px-3 py-2">
        {(currentPage - 1) * itemsPerPage + idx + 1}
      </td>

      {columnKeys.map((key) => {
        const rawValue = wallet[key];
        const isJsonArrayField = [
          "network",
          "deposit_address",
          "min_deposit",
          "confirmations_required",
        ].includes(key);

        let parsedItems = [];

        if (isJsonArrayField && typeof rawValue === "string") {
          try {
            parsedItems = JSON.parse(rawValue);
          } catch (e) {
            parsedItems = [];
            console.log(e);
            
          }
        }

        return (
          <td key={key} className="px-3 py-2 whitespace-nowrap align-top">
            {isJsonArrayField && Array.isArray(parsedItems) && parsedItems.length > 0 ? (
              <ul className="text-xs bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 space-y-1 max-w-[200px]">
                {parsedItems.map((item, index) => (
                  <li key={index} className="truncate list-disc ml-4">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              rawValue ?? "-"
            )}
          </td>
        );
      })}

      <td className="px-3 py-2 whitespace-nowrap text-right relative">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-1 hover:bg-zinc-800 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-700 rounded-md bg-[#1f1f1f] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleEdit(wallet)}
                    className={`${
                      active ? "bg-gray-700 text-white" : "text-gray-200"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Edit Wallet
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleDelete(wallet.id)}
                    className={`${
                      active ? "bg-red-600 text-white" : "text-red-400"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Delete Wallet
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center mt-4 text-sm text-white space-x-3'>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className='bg-gray-700 px-3 py-1 rounded disabled:opacity-50 flex items-center'
        >
          <ChevronLeft size={16} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className='bg-gray-700 px-3 py-1 rounded disabled:opacity-50 flex items-center'
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Edit Wallet Modal */}
      <Transition appear show={!!selectedWallet} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/70' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-2xl transform overflow-hidden rounded-xl bg-[#1f1f1f] p-6 text-white shadow-xl transition-all'>
                  <Dialog.Title className='text-lg font-semibold mb-4'>
                    Edit Wallet
                  </Dialog.Title>

                  <div className='space-y-4'>
                    {/* Editable Fields */}
                    {Object.entries(selectedWallet || {}).map(([key, val]) =>
                      (
                        ![
                          "id",
                          "created_at",
                          "updated_at",
                          "networks",
                          "network",
                          "deposit_address",
                          "min_deposit",
                          "confirmations_required",
                        ].includes(key)
                      ) ?
                        <div key={key}>
                          <label className='block mb-1 text-sm capitalize'>
                            {key}
                          </label>
                          <input
                            type='text'
                            value={val}
                            onChange={(e) =>
                              setSelectedWallet((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
                          />
                        </div>
                      : null
                    )}

                    {/* Networks */}
                    <h3 className='text-md font-semibold'>Networks</h3>
                    {(selectedWallet?.networks || []).map((net, index) => (
                      <div
                        key={index}
                        className='border border-gray-700 p-4 rounded-md space-y-2'
                      >
                        <div>
                          <label className='block text-sm mb-1'>
                            Network Name
                          </label>
                          <input
                            type='text'
                            value={net.name}
                            onChange={(e) => {
                              const updated = [...selectedWallet.networks];
                              updated[index].name = e.target.value;
                              setSelectedWallet({
                                ...selectedWallet,
                                networks: updated,
                              });
                            }}
                            className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
                          />
                        </div>
                        <div>
                          <label className='block text-sm mb-1'>
                            Deposit Address
                          </label>
                          <input
                            type='text'
                            value={net.deposit_address}
                            onChange={(e) => {
                              const updated = [...selectedWallet.networks];
                              updated[index].deposit_address = e.target.value;
                              setSelectedWallet({
                                ...selectedWallet,
                                networks: updated,
                              });
                            }}
                            className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
                          />
                        </div>
                        <div className='flex gap-4'>
                          <div className='flex-1'>
                            <label className='block text-sm mb-1'>
                              Confirmations
                            </label>
                            <input
                              type='number'
                              value={net.confirmations_required}
                              onChange={(e) => {
                                const updated = [...selectedWallet.networks];
                                updated[index].confirmations_required = Number(
                                  e.target.value
                                );
                                setSelectedWallet({
                                  ...selectedWallet,
                                  networks: updated,
                                });
                              }}
                              className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
                            />
                          </div>
                          <div className='flex-1'>
                            <label className='block text-sm mb-1'>
                              Min Deposit
                            </label>
                            <input
                              type='text'
                              value={net.min_deposit}
                              onChange={(e) => {
                                const updated = [...selectedWallet.networks];
                                updated[index].min_deposit = e.target.value;
                                setSelectedWallet({
                                  ...selectedWallet,
                                  networks: updated,
                                });
                              }}
                              className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const updated = selectedWallet.networks.filter(
                              (_, i) => i !== index
                            );
                            setSelectedWallet({
                              ...selectedWallet,
                              networks: updated,
                            });
                          }}
                          className='text-sm text-red-400 hover:underline mt-2'
                        >
                          Remove Network
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() =>
                        setSelectedWallet({
                          ...selectedWallet,
                          networks: [
                            ...(selectedWallet.networks || []),
                            {
                              name: "",
                              deposit_address: "",
                              confirmations_required: 1,
                              min_deposit: "",
                            },
                          ],
                        })
                      }
                      className='mt-2 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-sm'
                    >
                      + Add Network
                    </button>
                  </div>

                  <div className='mt-6 flex justify-end space-x-2'>
                    <button
                      onClick={closeModal}
                      className='px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className='px-4 py-2 bg-lime-600 rounded hover:bg-lime-500 text-sm'
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

export default WalletsTable;
