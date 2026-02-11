// src/components/modals/ImageViewerModal.jsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ImageViewerModal = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center bg-black/70">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-4xl p-4 my-20 overflow-hidden text-left align-middle transition-all transform modal-panel rounded-2xl">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="text-white text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Image"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImageViewerModal;





