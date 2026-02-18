import React, { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearTradeModal,
  setTradeActionError,
} from '../../slices/tradeSlice';
import { showError, showSuccess } from '../../utils/toast';
import { editTradeOrder } from '../../redux/thunks/tradeActionsThunk';

const EDITABLE_FIELDS = [
  'orderType',
  'timeInForce',
  'status',
  'price',
  'quantity',
  'quoteOrderQty',
  'orderValue',
  'leverage',
  'marginMode',
  'positionSide',
  'takeProfitPrice',
  'stopLossPrice',
];

const EditTradeModal = () => {
  const dispatch = useDispatch();
  const { selectedTrade, actionError, actionLoading } = useSelector((state) => state.trades);

  const initialForm = useMemo(() => {
    const form = {};
    EDITABLE_FIELDS.forEach((field) => {
      form[field] = selectedTrade?.[field] ?? '';
    });
    return form;
  }, [selectedTrade]);

  const [form, setForm] = useState(initialForm);

  const handleClose = () => {
    dispatch(setTradeActionError(null));
    dispatch(clearTradeModal());
  };

  const handleSave = async () => {
    const tradeId = selectedTrade?.orderId ?? selectedTrade?.id;
    if (!tradeId) {
      dispatch(setTradeActionError('No trade selected.'));
      showError('No trade selected.');
      return;
    }

    const changes = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, String(value ?? '').trim()])
    );

    try {
      await dispatch(editTradeOrder({ tradeId, payload: changes })).unwrap();
      dispatch(setTradeActionError(null));
      showSuccess('Trade details updated');
      dispatch(clearTradeModal());
    } catch (err) {
      dispatch(setTradeActionError(typeof err === 'string' ? err : 'Failed to edit trade details'));
      showError(typeof err === 'string' ? err : 'Failed to edit trade details');
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as='div' className='relative z-20' onClose={handleClose}>
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
          <div className='flex items-center justify-center min-h-full p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              leave='ease-in duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='modal-panel p-6 rounded-xl w-full max-w-2xl'>
                <Dialog.Title className='text-lg font-bold'>
                  Edit Trade Details
                </Dialog.Title>

                <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                  {EDITABLE_FIELDS.map((field) => (
                    <div key={field} className='space-y-1'>
                      <label className='text-xs text-slate-300 capitalize'>{field}</label>
                      <input
                        type='text'
                        className='input-dark w-full'
                        value={form[field]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                {actionError ? (
                  <p className='mt-3 text-xs text-red-400'>{actionError}</p>
                ) : null}

                <div className='flex justify-end mt-6 gap-3'>
                  <button
                    onClick={handleClose}
                    className='bg-red-600 px-4 py-2 rounded'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={actionLoading}
                    className='bg-blue-600 px-4 py-2 rounded'
                  >
                    {actionLoading ? 'Saving...' : 'Save'}
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

export default EditTradeModal;
