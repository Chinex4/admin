import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setTrades,
	deleteTrade,
	setSelectedTrade,
	setTradeModalType,
} from '../../slices/tradeSlice';
import TradeModalsManager from '../modals/TradeModalManager';

const dummyTrades = [
	{
		id: 1,
		userName: 'fname lname',
		amount: '232',
		symbol: 'USD/CHF',
		interval: '60 sec',
		leverage: '0.5X',
		stopLoss: '323',
		takeProfit: '323',
		entryPrice: '323',
		tradeType: 'sell',
		pairs: 'Forex Pairs',
		transId: '#uYiUPrZ2Ek',
		transStatus: 'Pending',
		date: '5/20/2025, 10:30:21 PM',
		outcome: '',
	},
];

const TradeTable = () => {
	const dispatch = useDispatch();
	const { trades } = useSelector((state) => state.trades);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setTrades(dummyTrades));
	}, [dispatch]);

	const filtered = trades.filter((t) =>
		Object.values(t).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	const handleModal = (trade, type) => {
		dispatch(setSelectedTrade(trade));
		dispatch(setTradeModalType(type));
	};

	return (
		<div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
			<h2 className='text-xl font-semibold text-white mb-4'>All Trades</h2>
			<input
				type='text'
				placeholder='Search trades...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
			/>
			<div className='overflow-x-auto rounded-xl scrollbar-hide'>
				<table className='table-auto text-sm text-left text-white w-full'>
					<thead className='bg-[#121212] text-gray-300'>
						<tr>
							<th className='px-3 py-2'>#</th>
							{Object.keys(dummyTrades[0])
								.filter((k) => k !== 'id')
								.map((key, idx) => (
									<th
										key={idx}
										className='px-3 py-2 whitespace-nowrap capitalize'>
										{key}
									</th>
								))}
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((trade, idx) => (
							<tr
								key={trade.id}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								<td className='px-3 py-2'>{idx + 1}</td>
								{Object.keys(trade)
									.filter((k) => k !== 'id')
									.map((key, i) => (
										<td
											key={i}
											className='px-3 py-2 whitespace-nowrap'>
											{trade[key]}
										</td>
									))}
								<td className='px-3 py-2 whitespace-nowrap space-x-2'>
									<button
										onClick={() => dispatch(deleteTrade(trade.id))}
										className='bg-red-600 px-3 py-1 rounded text-sm'>
										Delete Trade
									</button>
									<button
										onClick={() => handleModal(trade, 'loss')}
										className='bg-yellow-700 px-3 py-1 rounded text-sm'>
										Lose Trade
									</button>
									<button
										onClick={() => handleModal(trade, 'win')}
										className='bg-green-600 px-3 py-1 rounded text-sm'>
										Win Trade
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<TradeModalsManager />
		</div>
	);
};

export default TradeTable;
