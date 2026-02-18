import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ConfirmDeleteModal = ({
  isOpen,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this record?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-xl modal-panel p-6">
                <Dialog.Title className="text-lg font-semibold text-white">
                  {title}
                </Dialog.Title>
                <p className="mt-3 text-sm text-slate-300">{message}</p>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    className="button-ghost text-xs"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    className="button-danger text-xs"
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : confirmLabel}
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

export default ConfirmDeleteModal;
