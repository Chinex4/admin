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

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
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
          <Dialog.Panel className='w-full max-w-lg bg-[#121212] p-6 rounded-lg shadow-xl'>
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
                className='w-full p-2 bg-[#222] rounded'
              />
              <input
                {...register('documentType')}
                placeholder='Document Type'
                className='w-full p-2 bg-[#222] rounded'
              />
              <input
                {...register('idNumber')}
                placeholder='ID Number'
                className='w-full p-2 bg-[#222] rounded'
              />
              <input
                {...register('firstName')}
                placeholder='First Name'
                className='w-full p-2 bg-[#222] rounded'
              />
              <input
                {...register('lastName')}
                placeholder='Last Name'
                className='w-full p-2 bg-[#222] rounded'
              />
              <input
                {...register('dateOfBirth')}
                placeholder='Date of Birth'
                className='w-full p-2 bg-[#222] rounded'
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
