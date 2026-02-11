import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { clearWalletModal } from "../../slices/walletSlice";
import { updateWallet } from "../../redux/thunks/walletsThunk";

const EditWalletModal = () => {
  const dispatch = useDispatch();
  const { selectedWallet } = useSelector((state) => state.wallets);
  const { id, ...initialValues } = selectedWallet || {};
  const [form, setForm] = useState({ ...initialValues });

  const excludedKeys = ["id", "created_at", "updated_at"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateWallet({ id, ...form }));
    dispatch(clearWalletModal());
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => dispatch(clearWalletModal())}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl modal-panel p-6 transition-all">
                <Dialog.Title className="text-lg font-bold mb-4">
                  Edit Wallet
                </Dialog.Title>
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  {Object.keys(form).map((key) => {
                    if (excludedKeys.includes(key)) return null;
                    return (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm capitalize">{key}</label>
                        <input
                          type="text"
                          name={key}
                          value={form[key]}
                          onChange={handleChange}
                          className="input-dark text-sm"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-6 gap-3">
                  <button
                    onClick={() => dispatch(clearWalletModal())}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 px-4 py-2 rounded"
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
  );
};

export default EditWalletModal;




