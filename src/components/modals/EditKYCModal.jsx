import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateKycAsync } from '../../slices/kycSlice';

const EditKycModal = ({ isOpen, setIsOpen, kycData }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (kycData) reset(kycData);
  }, [kycData]);
  const createdAt = new Date().toLocaleString('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });


  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    formData.append('createdAt', createdAt);
    dispatch(updateKycAsync({ id: kycData.id, formData }));
    setIsOpen(false);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className='relative z-50'>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/50' />
        </Transition.Child>

        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <Dialog.Panel className='w-full max-w-lg modal-panel p-6'>
            <Dialog.Title className='text-white text-lg font-semibold mb-4'>
              Edit KYC
            </Dialog.Title>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-3 text-white'
            >
              <input
                {...register('country')}
                placeholder='Country'
                className='input-dark'
              />
              <input
                {...register('documentType')}
                placeholder='Document Type'
                className='input-dark'
              />
              <input
                {...register('idNumber')}
                placeholder='ID Number'
                className='input-dark'
              />
              <input
                {...register('firstName')}
                placeholder='First Name'
                className='input-dark'
              />
              <input
                {...register('lastName')}
                placeholder='Last Name'
                className='input-dark'
              />
              <input
                {...register('dateOfBirth')}
                placeholder='Date of Birth'
                className='input-dark'
              />
              <input
                {...register('status')}
                placeholder='Status'
                className='input-dark'
              />
              <input
                type='file'
                {...register('frontImage')}
                className='text-white'
              />
              <input
                type='file'
                {...register('backImage')}
                className='text-white'
              />
              <div className='flex justify-end'>
                <button type='submit' className='bg-lime-600 px-4 py-2 rounded'>
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditKycModal;




