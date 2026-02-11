import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTraders, deleteTrader } from '../../slices/copyTraderSlice';

const dummyTraders = [
	{
		id: 1,
		profitShares: 12,
		tradeImage: 'https://via.placeholder.com/50',
		traderName: 'Jonathan Steele',
		traderAbbr: 'JST',
		winRate: '88.72',
	},
];

const CopyTradersTable = () => {
	const dispatch = useDispatch();
	const { traders } = useSelector((state) => state.copyTraders);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setTraders(dummyTraders));
	}, [dispatch]);

	const filtered = traders.filter((trader) =>
		Object.values(trader).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 panel panel-pad'>
			<h2 className='text-xl font-semibold text-white mb-4'>Copy Traders</h2>

			<input
				type='text'
				placeholder='Search trader...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='input-dark mb-4'
			/>

			<div className='table-wrap scrollbar-hide'>
				<table className='table-base'>
					<thead className='table-head'>
						<tr>
							<th className='px-3 py-2'>#</th>
							<th className='px-3 py-2'>Profit Shares</th>
							<th className='px-3 py-2'>Trade Image</th>
							<th className='px-3 py-2'>Trader's Name</th>
							<th className='px-3 py-2'>Abbreviated</th>
							<th className='px-3 py-2'>Win Rate</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((trader, idx) => (
							<tr
								key={trader.id}
								className='table-row'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{trader.profitShares}</td>
								<td className='px-3 py-2'>
									<img
										src={trader.tradeImage}
										alt='trade'
										className='w-10 h-10 object-cover rounded'
									/>
								</td>
								<td className='px-3 py-2'>{trader.traderName}</td>
								<td className='px-3 py-2'>{trader.traderAbbr}</td>
								<td className='px-3 py-2'>{trader.winRate}%</td>
								<td className='px-3 py-2 whitespace-nowrap'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteTrader(trader.id))}>
										Delete Trader
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

export default CopyTradersTable;


