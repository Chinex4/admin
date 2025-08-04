import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setKycs } from '../../slices/kycSlice';
import { Popover, Transition } from '@headlessui/react';
import { EllipsisVertical } from 'lucide-react';
import {
  approveKycAsync,
  disapproveKycAsync,
  deleteKycAsync,
  fetchBasicKycs
} from '../../slices/kycSlice';


const KycTable = () => {
  const dispatch = useDispatch();
  const basicKycs = useSelector((state) => state.kyc.basicKycs); // ✅ FIXED
  const [search, setSearch] = useState('');


  useEffect(() => {
    dispatch(fetchBasicKycs());
  }, [dispatch]);

  const filtered = basicKycs.filter((kyc) =>
    Object.values(kyc).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const directActions = [
    { label: 'Delete KYC', action: (id) => dispatch(deleteKycAsync(id)) },
    { label: 'Approve KYC', action: (id) => dispatch(approveKycAsync(id)) },
    {
      label: 'Disapprove KYC',
      action: (id) => dispatch(disapproveKycAsync(id)),
    },
  ];

  return (
    <div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
      <h2 className='text-xl font-semibold text-white mb-4'>KYC Submissions</h2>
      <input
        type='text'
        placeholder='Search KYC...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
      />
      <div className='overflow-x-auto rounded-xl scrollbar-hide'>
        <table className='table-auto text-sm text-left text-white w-full'>
          <thead className='bg-[#121212] text-gray-300'>
            <tr>
              <th className='px-3 py-2'>#</th>
              <th className='px-3 py-2'>KYC ID</th>
              <th className='px-3 py-2'>User ID</th>
              <th className='px-3 py-2'>Country</th>
              <th className='px-3 py-2'>Document Type</th>
              <th className='px-3 py-2'>ID Number</th>
              <th className='px-3 py-2'>First Name</th>
              <th className='px-3 py-2'>Last Name</th>
              <th className='px-3 py-2'>Date of Birth</th>
              <th className='px-3 py-2'>Front Image</th>
              <th className='px-3 py-2'>Back Image</th>
              <th className='px-3 py-2'>Status</th>
              <th className='px-3 py-2'>Created At</th>
              <th className='px-3 py-2'>Approved At</th>
              <th className='px-3 py-2'>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((kyc, idx) => (
              <tr
                key={kyc.id}
                className='border-b border-gray-800 hover:bg-[#2a2a2a]'
              >
                <td className='px-3 py-2'>{idx + 1}</td>
                <td className='px-3 py-2'>{kyc.kycId}</td>
                <td className='px-3 py-2'>{kyc.userId}</td>
                <td className='px-3 py-2'>{kyc.country}</td>
                <td className='px-3 py-2'>{kyc.documentType}</td>
                <td className='px-3 py-2'>{kyc.idNumber}</td>
                <td className='px-3 py-2'>{kyc.firstName}</td>
                <td className='px-3 py-2'>{kyc.lastName}</td>
                <td className='px-3 py-2'>{kyc.dateOfBirth}</td>

                <td className='px-3 py-2'>
                  {kyc.frontImage ? (
                    <a
                      href={kyc.frontImage}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img
                        src={kyc.frontImage}
                        alt='front'
                        className='w-16 h-16 object-cover rounded hover:opacity-90 transition duration-150'
                      />
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>

                <td className='px-3 py-2'>
                  {kyc.backImage ? (
                    <a
                      href={kyc.backImage}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img
                        src={kyc.backImage}
                        alt='back'
                        className='w-16 h-16 object-cover rounded hover:opacity-90 transition duration-150'
                      />
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>

                <td className='px-3 py-2'>{kyc.status}</td>
                <td className='px-3 py-2'>{kyc.createdAt || '—'}</td>
                <td className='px-3 py-2'>{kyc.approveDate || '—'}</td>
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
                              onClick={() => action(kyc.id)}
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
  );
};

export default KycTable;
