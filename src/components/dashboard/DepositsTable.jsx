import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setDeposits,
	setSelectedDeposit,
	setDepositModalType,
	deleteDeposit,
} from '../../slices/depositSlice';
import DepositsManager from '../modals/DepositManager';

const dummyDeposits = [
	{
		id: 1,
		userName: 'fname lname',
		amountValue: '0.0052796264543191',
		amount: '545455',
		transactionMethod: 'bitcoin',
		userID: '46a5ad400018e84a66adefac8273608d',
		wallet: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		transactionIdentifier: '#K4O9dRTn1v',
		userBalance: '1017273',
		transactionStatus: 'Pending',
		date: '5/15/2025, 11:03:11 PM',
	},
	{
		id: 2,
		userName: 'fname lname',
		amountValue: '0.86133477856922',
		amount: '89000',
		transactionMethod: 'bitcoin',
		userID: '46a5ad400018e84a66adefac8273608d',
		wallet: 'furghugwnurngugugrggg',
		transactionIdentifier: '#7KtvLAGsVP',
		userBalance: '1025860',
		transactionStatus: 'Pending',
		date: '5/13/2025, 3:15:33 PM',
	},
];

const DepositsTable = () => {
	const dispatch = useDispatch();
	const { deposits } = useSelector((state) => state.deposits);

	useEffect(() => {
		dispatch(setDeposits(dummyDeposits));
	}, [dispatch]);

	const handleModal = (deposit, type) => {
		dispatch(setSelectedDeposit(deposit));
		dispatch(setDepositModalType(type));
	};

	const handleDelete = (id) => {
		dispatch(deleteDeposit(id));
	};

	return (
		<div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
			<h2 className='text-xl font-semibold text-white mb-4'>All Deposits</h2>
			<div className='overflow-x-auto rounded-xl scrollbar-hide'>
				<table className='table-auto text-sm text-left text-white w-full'>
					<thead className='bg-[#121212] text-gray-300'>
						<tr>
							<th className='px-3 py-2 whitespace-nowrap'>#</th>
							{Object.keys(deposits[0] || {})
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
						{deposits.map((dep, idx) => (
							<tr
								key={dep.id}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								<td className='px-3 py-2'>{idx + 1}</td>
								{Object.keys(dep)
									.filter((k) => k !== 'id')
									.map((key, i) => (
										<td
											key={i}
											className='px-3 py-2 whitespace-nowrap'>
											{dep[key]}
										</td>
									))}
								<td className='px-3 py-2 space-x-1 whitespace-nowrap'>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => handleModal(dep, 'edit')}>
										Edit Deposit Details
									</button>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => handleDelete(dep.id)}>
										Delete Deposit
									</button>
									<button className='bg-red-700 px-3 py-1 rounded text-sm'>
										Disapprove Deposit
									</button>
									<button className='bg-green-600 px-3 py-1 rounded text-sm'>
										Approve Deposit
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<DepositsManager />
		</div>
	);
};

export default DepositsTable;
