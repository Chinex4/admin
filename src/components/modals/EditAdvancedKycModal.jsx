import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

const EditAdvancedKycModal = ({ isOpen, onClose, kyc, onSave }) => {
  const [formData, setFormData] = useState({
    status: '',
    rejectionReason: '',
  });

  const createdAt = new Date().toLocaleString('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    const dataWithTimestamp = {
      ...formData,
      createdAt, // or use kyc.createdAt if you want to retain original
    };

    onSave(dataWithTimestamp);
    onClose();
  };

  if (!kyc) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/50' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='modal-panel p-6 w-full max-w-md'>
          <Dialog.Title className='text-lg font-bold mb-4'>
            Edit KYC
          </Dialog.Title>
          <div className='space-y-3'>
            <label className='block'>
              <span className='muted-text text-sm'>Status</span>
              <input
                type='text'
                name='status'
                value={formData.status}
                onChange={handleChange}
                className='input-dark'
              />
            </label>
            <label className='block'>
              <span className='muted-text text-sm'>Rejection Reason</span>
              <input
                type='text'
                name='rejectionReason'
                value={formData.rejectionReason}
                onChange={handleChange}
                className='input-dark'
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




