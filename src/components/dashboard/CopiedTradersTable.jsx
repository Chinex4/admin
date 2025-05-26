import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setCopiedTraders,
	deleteCopiedTrader,
	approveCopiedTrader,
	disapproveCopiedTrader,
} from '../../slices/copiedTraderSlice';

const dummyCopied = [
	{
		id: 1,
		userName: 'fname lname',
		traderName: 'Sylvester lines',
		amount: '787',
		copyStatus: 'Disapproved',
	},
	{
		id: 2,
		userName: 'Henry Richard',
		traderName: 'furghugwnurngugugrggg',
		amount: '2000',
		copyStatus: 'Approved',
	},
	{
		id: 3,
		userName: 'fname lname',
		traderName: 'Jonathan Steele',
		amount: '233',
		copyStatus: 'Disapproved',
	},
];

const CopiedTradersTable = () => {
	const dispatch = useDispatch();
	const { copiedTraders } = useSelector((state) => state.copiedTraders);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setCopiedTraders(dummyCopied));
	}, [dispatch]);

	const filtered = copiedTraders.filter((trader) =>
		Object.values(trader).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
			<h2 className='text-xl font-semibold text-white mb-4'>Copied Traders</h2>

			<input
				type='text'
				placeholder='Search copied trader...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
			/>

			<div className='overflow-x-auto rounded-xl'>
				<table className='table-auto text-sm text-left text-white w-full'>
					<thead className='bg-[#121212] text-gray-300'>
						<tr>
							<th className='px-3 py-2'>#</th>
							<th className='px-3 py-2'>User Name</th>
							<th className='px-3 py-2'>Trader Name</th>
							<th className='px-3 py-2'>Amount</th>
							<th className='px-3 py-2'>Copy Status</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((trader, idx) => (
							<tr
								key={trader.id}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{trader.userName}</td>
								<td className='px-3 py-2'>{trader.traderName}</td>
								<td className='px-3 py-2'>{trader.amount}</td>
								<td className='px-3 py-2'>{trader.copyStatus}</td>
								<td className='px-3 py-2 whitespace-nowrap space-x-1'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteCopiedTrader(trader.id))}>
										Delete
									</button>
									<button
										className='bg-green-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(approveCopiedTrader(trader.id))}>
										Approve
									</button>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(disapproveCopiedTrader(trader.id))}>
										Disapprove
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

export default CopiedTradersTable;
