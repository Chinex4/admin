import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/thunks/usersThunk";
import { clearModal } from "../../slices/userSlice";

const EditUserModal = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.users);
  const { id: _, ...rest } = selectedUser;
  const isGoogleAuthKey = (key) =>
    String(key || "")
      .toLowerCase()
      .replace(/[_\s-]/g, "")
      .includes("googleauth");

  const isBalanceJsonKey = (key) => {
    const normalized = String(key || "")
      .toLowerCase()
      .replace(/[_\s-]/g, "");
    return normalized === "balancesjson" || normalized === "balancejson";
  };

  const toVerificationStatus = (value) => {
    const normalized = String(value ?? "").trim().toLowerCase();
    if (
      normalized === "1" ||
      normalized === "true" ||
      normalized === "yes" ||
      normalized === "verified"
    ) {
      return "verified";
    }
    return "not_verified";
  };

  const fromVerificationStatus = (status, originalValue) => {
    const isVerified = status === "verified";
    if (typeof originalValue === "boolean") return isVerified;
    if (typeof originalValue === "number") return isVerified ? 1 : 0;

    const normalizedOriginal = String(originalValue ?? "").trim().toLowerCase();
    if (normalizedOriginal === "true" || normalizedOriginal === "false") {
      return isVerified ? "true" : "false";
    }
    if (
      normalizedOriginal === "verified" ||
      normalizedOriginal === "not verified" ||
      normalizedOriginal === "not_verified"
    ) {
      return isVerified ? "verified" : "not verified";
    }
    return isVerified ? "1" : "0";
  };

  const [form, setForm] = useState(() => {
    const initial = { ...rest };
    Object.keys(initial).forEach((key) => {
      if (isGoogleAuthKey(key)) {
        initial[key] = toVerificationStatus(initial[key]);
      }
    });
    return initial;
  });

  const excludedKeys = ["crypto", "signalMsg", "id"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const payload = { ...form };
    Object.keys(payload).forEach((key) => {
      if (isGoogleAuthKey(key)) {
        payload[key] = fromVerificationStatus(payload[key], selectedUser?.[key]);
      }
    });

    dispatch(updateUser(payload));
    dispatch(clearModal());
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-20'
        onClose={() => dispatch(clearModal())}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          leave='ease-in duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-50' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              leave='ease-in duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-xl modal-panel p-6 transition-all'>
                <Dialog.Title className='text-lg font-bold mb-4'>
                  Edit User
                </Dialog.Title>
                <div className='grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto'>
                  {Object.keys(form).map((key) => {
                    if (excludedKeys.includes(key) || isBalanceJsonKey(key)) return null;
                    if (isGoogleAuthKey(key)) {
                      return (
                        <div key={key} className='flex flex-col'>
                          <label className='text-sm capitalize'>{key}</label>
                          <select
                            name={key}
                            value={form[key]}
                            onChange={handleChange}
                            className='input-dark text-sm'
                          >
                            <option value='verified'>Verified</option>
                            <option value='not_verified'>Not Verified</option>
                          </select>
                        </div>
                      );
                    }
                    return (
                      <div key={key} className='flex flex-col'>
                        <label className='text-sm capitalize'>{key}</label>
                        <input
                          type='text'
                          name={key}
                          value={form[key]}
                          onChange={handleChange}
                          className='input-dark text-sm'
                        />
                      </div>
                    );
                  })}
                </div>
                <div className='flex justify-end mt-6 gap-3'>
                  <button
                    onClick={() => dispatch(clearModal())}
                    className='bg-red-600 px-4 py-2 rounded'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className='bg-green-600 px-4 py-2 rounded'
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

export default EditUserModal;




