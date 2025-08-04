import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, Transition } from '@headlessui/react';
import { EllipsisVertical } from 'lucide-react';
import {
  fetchInstitutionalVerifications,
  approveInstitution,
  rejectInstitution,
  deleteInstitution,
} from '../../slices/institutionSlice';
import EditInstitutionModal from '../modals/EditInstitutionModal';
import { updateInstitution } from './../../slices/institutionSlice';

const dummyInstitutionData = [
  {
    id: 1,
    contact: 'Mr. Anderson',
    email: 'anderson@financegroup.com',
    institutionName: 'Finance Group Inc.',
    location: 'Toronto, Canada',
    assets: '$15M+',
    createdAt: '2025-08-04 14:22:00',
  },
];

const InstitutionalVerificationTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(dummyInstitutionData);
  const [search, setSearch] = useState('');
  const institutions = useSelector((state) => state.institution.list);

  useEffect(() => {
    dispatch(fetchInstitutionalVerifications());
  }, [dispatch]);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (entry) => {
    setEditingInstitution(entry);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (updatedData) => {
    // Dispatch updateInstitutionAsync if available
    dispatch(
      updateInstitution({ id: editingInstitution.id, updates: updatedData }),
    );
  };
  const filtered = data.filter((entry) =>
    Object.values(entry).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const directActions = [
    { label: 'Edit', action: (entry) => handleEdit(entry) },
    { label: 'Approve', action: (id) => dispatch(approveInstitution(id)) },
    { label: 'Reject', action: (id) => dispatch(rejectInstitution(id)) },
    { label: 'Delete', action: (id) => dispatch(deleteInstitution(id)) },
  ];

  return (
    <>
      <div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
        <h2 className='text-xl font-semibold text-white mb-4'>
          Institutional Verifications
        </h2>
        <input
          type='text'
          placeholder='Search...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
        />
        <div className='overflow-x-auto rounded-xl scrollbar-hide'>
          <table className='table-auto text-sm text-left text-white w-full'>
            <thead className='bg-[#121212] text-gray-300'>
              <tr>
                <th className='px-3 py-2'>#</th>
                <th className='px-3 py-2'>Contact</th>
                <th className='px-3 py-2'>Email</th>
                <th className='px-3 py-2'>Institution Name</th>
                <th className='px-3 py-2'>Location</th>
                <th className='px-3 py-2'>Assets</th>
                <th className='px-3 py-2'>Created At</th>
                <th className='px-3 py-2'>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className='border-b border-gray-800 hover:bg-[#2a2a2a]'
                >
                  <td className='px-3 py-2'>{idx + 1}</td>
                  <td className='px-3 py-2'>{entry.contact}</td>
                  <td className='px-3 py-2'>{entry.email}</td>
                  <td className='px-3 py-2'>{entry.institutionName}</td>
                  <td className='px-3 py-2'>{entry.location}</td>
                  <td className='px-3 py-2'>{entry.assets}</td>
                  <td className='px-3 py-2'>{entry.createdAt}</td>
                  <td className='px-3 py-2 relative z-50'>
                    <Popover className='relative z-50'>
                      <>
                        <Popover.Button className='text-white hover:text-gray-300'>
                          <EllipsisVertical className='w-5 h-5' />
                        </Popover.Button>

                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-200'
                          enterFrom='opacity-0 scale-95'
                          enterTo='opacity-100 scale-100'
                          leave='transition ease-in duration-150'
                          leaveFrom='opacity-100 scale-100'
                          leaveTo='opacity-0 scale-95'
                        >
                          <Popover.Panel
                            static
                            className='fixed top-[63%] left-[43%] lg:left-[85%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#111] text-white shadow-md rounded-md border border-gray-700 p-2 w-64 space-y-1 text-sm'
                          >
                            <p className='text-gray-400 text-xs mb-1'>
                              Direct Actions
                            </p>
                            {directActions.map(({ label, action }, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  label === 'Edit'
                                    ? action(entry)
                                    : action(entry.id)
                                }
                                className='w-full text-left px-2 py-1 hover:bg-[#222] rounded'
                              >
                                {label}
                              </button>
                            ))}
                          </Popover.Panel>
                        </Transition>
                      </>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditInstitutionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        institution={editingInstitution}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default InstitutionalVerificationTable;
