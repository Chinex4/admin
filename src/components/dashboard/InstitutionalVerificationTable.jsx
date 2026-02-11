import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, Transition } from '@headlessui/react';
import {
  fetchInstitutionalVerifications,
  approveInstitution,
  rejectInstitution,
  deleteInstitution,
  updateInstitution,
} from '../../slices/institutionSlice';
import EditInstitutionModal from '../modals/EditInstitutionModal';

const InstitutionalVerificationTable = () => {
  const dispatch = useDispatch();
  const institutions = useSelector((state) => state.institution.list);
  const [search, setSearch] = useState('');
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInstitutionalVerifications());
  }, [dispatch]);

  const handleEdit = (entry) => {
    setEditingInstitution(entry);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (updatedData) => {
    dispatch(
      updateInstitution({ id: editingInstitution.id, updates: updatedData }),
    );
  };

  const filtered = institutions.filter((entry) =>
    Object.values(entry).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const directActions = [
    // {
    //   label: 'Edit',
    //   action: (id) => handleEdit(filtered.find((f) => f.id === id)),
    // },
    { label: 'Approve', action: (id) => dispatch(approveInstitution(id)) },
    { label: 'Reject', action: (id) => dispatch(rejectInstitution(id)) },
    { label: 'Delete', action: (id) => dispatch(deleteInstitution(id)) },
  ];

  return (
    <>
      <div className='mt-6 panel panel-pad'>
        <h2 className='text-xl font-semibold text-white mb-4'>
          Institutional Verifications
        </h2>
        <input
          type='text'
          placeholder='Search...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='input-dark mb-4'
        />

        <div className='table-wrap scrollbar-hide'>
          <table className='table-base min-w-[1200px]'>
            <thead className='table-head'>
              <tr>
                <th className='px-3 py-2'>#</th>
                <th className='px-3 py-2'>Contact</th>
                <th className='px-3 py-2'>Email</th>
                <th className='px-3 py-2'>Institution Name</th>
                <th className='px-3 py-2'>Location</th>
                <th className='px-3 py-2'>Assets</th>
                <th className='px-3 py-2'>Status</th>
                <th className='px-3 py-2'>Created At</th>
                <th className='px-3 py-2'>IP Address</th>
                <th className='px-3 py-2'>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className='table-row'
                >
                  <td className='px-3 py-2'>{idx + 1}</td>
                  <td className='px-3 py-2 break-words whitespace-normal'>
                    {entry.contact}
                  </td>
                  <td className='px-3 py-2 break-words whitespace-normal max-w-[200px]'>
                    {entry.email}
                  </td>
                  <td className='px-3 py-2 break-words whitespace-normal'>
                    {entry.institutionName}
                  </td>
                  <td className='px-3 py-2'>{entry.location}</td>
                  <td className='px-3 py-2'>{entry.assets}</td>
                  <td className='px-3 py-2'>{entry.status}</td>
                  <td className='px-3 py-2'>{entry.createdAt}</td>
                  <td className='px-3 py-2'>{entry.ipAddress}</td>
                  <td className='px-3 py-2 relative z-50'>
                    <Popover className='relative z-50'>
                      <>
                        <Popover.Button className='icon-button'>
                          <i className='bi bi-three-dots-vertical' />
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
                            className='fixed top-[63%] left-[43%] lg:left-[85%] transform -translate-x-1/2 -translate-y-1/2 z-50 menu-panel'
                          >
                            <p className='muted-text text-xs mb-1'>
                              Direct Actions
                            </p>
                            {directActions.map(({ label, action }, i) => (
                              <button
                                key={i}
                                onClick={() => action(entry.id)}
                                className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded'
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

      {/* Edit modal rendered outside scroll */}
      <div className='z-[9999]'>
        <EditInstitutionModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          institution={editingInstitution}
          onSave={handleSaveEdit}
        />
      </div>
    </>
  );
};

export default InstitutionalVerificationTable;




