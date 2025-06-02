import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setSignals,
	deleteSignal,
	approveSignal,
	disapproveSignal,
} from '../../slices/signalSlice';

const dummySignals = [
	{
		id: 1,
		userName: 'fname lname',
		multiplier: '7X',
		signalType: 'BEGINNER TRADING SIGNAL',
		amount: 100,
		coin: 'BTC',
		subscriptionType: 'Signal Subscription',
		status: null,
	},
	{
		id: 2,
		userName: 'fname lname',
		multiplier: '7X',
		signalType: 'SILVER TRADING SIGNAL',
		amount: 300,
		coin: 'BTC',
		subscriptionType: 'Signal Subscription',
		status: null,
	},
	{
		id: 3,
		userName: 'fname lname',
		multiplier: '7X',
		signalType: 'SILVER TRADING SIGNAL',
		amount: 300,
		coin: 'BTC',
		subscriptionType: 'Signal Subscription',
		status: 'Approved',
	},
];

const SignalTable = () => {
	const dispatch = useDispatch();
	const { signals } = useSelector((state) => state.signals);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setSignals(dummySignals));
	}, [dispatch]);

	const filtered = signals.filter((signal) =>
		Object.values(signal).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
			<h2 className='text-xl font-semibold text-white mb-4'>
				Signal Subscriptions
			</h2>

			<input
				type='text'
				placeholder='Search signals...'
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
							<th className='px-3 py-2'>Multiplier</th>
							<th className='px-3 py-2'>Signal Type</th>
							<th className='px-3 py-2'>Amount</th>
							<th className='px-3 py-2'>Coin</th>
							<th className='px-3 py-2'>Subscription Type</th>
							<th className='px-3 py-2'>Status</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((signal, idx) => (
							<tr
								key={signal.id}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{signal.userName}</td>
								<td className='px-3 py-2'>{signal.multiplier}</td>
								<td className='px-3 py-2'>{signal.signalType}</td>
								<td className='px-3 py-2'>{signal.amount}</td>
								<td className='px-3 py-2'>{signal.coin}</td>
								<td className='px-3 py-2'>{signal.subscriptionType}</td>
								<td className='px-3 py-2'>{signal.status || 'Pending'}</td>
								<td className='px-3 py-2 space-x-2 whitespace-nowrap'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteSignal(signal.id))}>
										Delete
									</button>
									<button
										className='bg-green-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(approveSignal(signal.id))}>
										Approve
									</button>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(disapproveSignal(signal.id))}>
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

export default SignalTable;
