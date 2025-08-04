import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';

const EditInstitutionModal = ({ isOpen, onClose, institution, onSave }) => {
  const [formData, setFormData] = useState({
    contact: '',
    email: '',
    institutionName: '',
    location: '',
    assets: '',
  });

  useEffect(() => {
    if (institution) {
      setFormData({
        contact: institution.contact || '',
        email: institution.email || '',
        institutionName: institution.institutionName || '',
        location: institution.location || '',
        assets: institution.assets || '',
      });
    }
  }, [institution]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const createdAt = new Date().toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    onSave({ ...formData, createdAt });
    onClose();
  };

  if (!institution) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/50' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-[#111] p-6 rounded-md w-full max-w-md border border-gray-700 text-white'>
          <Dialog.Title className='text-lg font-bold mb-4'>
            Edit Institution
          </Dialog.Title>
          <div className='space-y-3'>
            {['contact', 'email', 'institutionName', 'location', 'assets'].map(
              (field) => (
                <label key={field} className='block'>
                  <span className='text-sm text-gray-300 capitalize'>
                    {field}
                  </span>
                  <input
                    type='text'
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className='w-full mt-1 px-3 py-2 bg-black border border-gray-700 rounded-md text-white'
                  />
                </label>
              ),
            )}
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

export default EditInstitutionModal;
