import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setWithdrawals,
	setSelectedWithdraw,
	setWithdrawModalType,
	deleteWithdraw,
} from '../../slices/withdrawSlice';
import WithdrawManager from '../modals/WithdrawalManager';

const dummyWithdrawals = [
	{
		id: 1,
		userName: 'fname lname',
		amount: '€3466',
		withdrawalMethod: 'Polkadot',
		wallet: '44fffecd38g0g4f4fui4jfp89j4[j9jf9jofj43f4',
		withdrawalIdentifier: '#IcaAhjHg1N',
		withdrawalStatus: 'Approved',
		date: '5/12/2025, 2:32:41 PM',
	},
];

const WithdrawTable = () => {
	const dispatch = useDispatch();
	const { withdrawals } = useSelector((state) => state.withdrawals);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setWithdrawals(dummyWithdrawals));
	}, [dispatch]);

	const filtered = withdrawals.filter((w) =>
		Object.values(w).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	const handleModal = (withdraw, type) => {
		dispatch(setSelectedWithdraw(withdraw));
		dispatch(setWithdrawModalType(type));
	};

	return (
		<div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
			<h2 className='text-xl font-semibold text-white mb-4'>All Withdrawals</h2>
			<input
				type='text'
				placeholder='Search withdrawal...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
			/>
			<div className='overflow-x-auto rounded-xl scrollbar-hide'>
				<table className='table-auto text-sm text-left text-white w-full'>
					<thead className='bg-[#121212] text-gray-300'>
						<tr>
							<th className='px-3 py-2 whitespace-nowrap'>#</th>
							{Object.keys(dummyWithdrawals[0])
								.filter((k) => k !== 'id')
								.map((key, idx) => (
									<th
										key={idx}
										className='px-3 py-2 whitespace-nowrap capitalize'>
										{key}
									</th>
								))}
							<th className='px-3 py-2 whitespace-nowrap'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((withdraw, idx) => (
							<tr
								key={withdraw.id}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								<td className='px-3 py-2'>{idx + 1}</td>
								{Object.keys(withdraw)
									.filter((k) => k !== 'id')
									.map((key, i) => (
										<td
											key={i}
											className='px-3 py-2 whitespace-nowrap'>
											{withdraw[key]}
										</td>
									))}
								<td className='px-3 py-2 space-x-1 whitespace-nowrap'>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => handleModal(withdraw, 'edit')}>
										Edit Withdrawal Details
									</button>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteWithdraw(withdraw.id))}>
										Delete Withdrawal
									</button>
									<button className='bg-red-700 px-3 py-1 rounded text-sm'>
										Disapprove Withdrawal
									</button>
									<button className='bg-green-600 px-3 py-1 rounded text-sm'>
										Approve Withdrawal
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<WithdrawManager />
		</div>
	);
};

export default WithdrawTable;
