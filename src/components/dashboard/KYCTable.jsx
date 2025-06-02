import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setKycs,
	deleteKyc,
	approveKyc,
	disapproveKyc,
} from '../../slices/kycSlice';

const dummyKycs = [
	{
		id: 1,
		userName: 'fname undefined',
		documentType: 'passport',
		userId: '46a5ad400018e84a66adefac8273608d',
		frontView: 'https://via.placeholder.com/100', // Replace with actual image links
		backView: '',
		status: 'Approved',
		submitDate: '5/15/2025, 6:58:31 AM',
		approveDate: null,
	},
];

const KycTable = () => {
	const dispatch = useDispatch();
	const { kycs } = useSelector((state) => state.kycs);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setKycs(dummyKycs));
	}, [dispatch]);

	const filtered = kycs.filter((kyc) =>
		Object.values(kyc).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

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
							<th className='px-3 py-2'>User Name</th>
							<th className='px-3 py-2'>Document Type</th>
							<th className='px-3 py-2'>User ID</th>
							<th className='px-3 py-2'>Front View</th>
							<th className='px-3 py-2'>Back View</th>
							<th className='px-3 py-2'>Status</th>
							<th className='px-3 py-2'>Submit Date</th>
							<th className='px-3 py-2'>Approve Date</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((kyc, idx) => (
							<tr
								key={kyc.id}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{kyc.userName}</td>
								<td className='px-3 py-2'>{kyc.documentType}</td>
								<td className='px-3 py-2'>{kyc.userId}</td>
								<td className='px-3 py-2'>
									{kyc.frontView ? (
										<img
											src={kyc.frontView}
											alt='front'
											className='w-16 h-16 object-cover rounded'
										/>
									) : (
										'N/A'
									)}
								</td>
								<td className='px-3 py-2'>
									{kyc.backView ? (
										<img
											src={kyc.backView}
											alt='back'
											className='w-16 h-16 object-cover rounded'
										/>
									) : (
										'N/A'
									)}
								</td>
								<td className='px-3 py-2'>{kyc.status}</td>
								<td className='px-3 py-2'>{kyc.submitDate}</td>
								<td className='px-3 py-2'>{kyc.approveDate || '—'}</td>
								<td className='px-3 py-2 whitespace-nowrap space-x-1'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteKyc(kyc.id))}>
										Delete KYC
									</button>
									<button
										className='bg-green-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(approveKyc(kyc.id))}>
										Approve KYC
									</button>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(disapproveKyc(kyc.id))}>
										Disapprove KYC
									</button>
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
