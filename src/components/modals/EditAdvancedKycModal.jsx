import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

const EditAdvancedKycModal = ({ isOpen, onClose, kyc, onSave }) => {
  const [formData, setFormData] = useState({
    status: '',
    rejectionReason: '',
  });

  useEffect(() => {
    if (kyc) {
      setFormData({
        status: kyc.status || '',
        rejectionReason: kyc.rejectionReason || '',
      });
    }
  }, [kyc]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!kyc) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/50' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-[#111] p-6 rounded-md w-full max-w-md border border-gray-700 text-white'>
          <Dialog.Title className='text-lg font-bold mb-4'>
            Edit KYC
          </Dialog.Title>
          <div className='space-y-3'>
            <label className='block'>
              <span className='text-sm text-gray-300'>Status</span>
              <input
                type='text'
                name='status'
                value={formData.status}
                onChange={handleChange}
                className='w-full mt-1 px-3 py-2 bg-black border border-gray-700 rounded-md text-white'
              />
            </label>
            <label className='block'>
              <span className='text-sm text-gray-300'>Rejection Reason</span>
              <input
                type='text'
                name='rejectionReason'
                value={formData.rejectionReason}
                onChange={handleChange}
                className='w-full mt-1 px-3 py-2 bg-black border border-gray-700 rounded-md text-white'
              />
            </label>
          </div>
          <div className='mt-5 flex justify-end space-x-2'>
            <button onClick={onClose} className='px-4 py-2 bg-gray-700 rounded'>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className='px-4 py-2 bg-lime-500 text-black rounded'
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditAdvancedKycModal;
