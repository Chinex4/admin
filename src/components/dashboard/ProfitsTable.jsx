import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfits, deleteProfit } from '../../slices/profitSlice';

const dummyProfits = [
	{
		id: 1,
		userName: 'fname lname',
		amount: '20333',
		balance: '1020371',
		createdAt: '5/13/2025, 2:20:16 PM',
		token: '46a5ad400018e84a66adefac8273608d',
		transId: '#hTKoQ7uWyX',
		transStatus: 'Approved',
		transType: 'Profit',
	},
];

const ProfitsTable = () => {
	const dispatch = useDispatch();
	const { profits } = useSelector((state) => state.profits);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setProfits(dummyProfits));
	}, [dispatch]);

	const filtered = profits.filter((profit) =>
		Object.values(profit).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 panel panel-pad'>
			<h2 className='text-xl font-semibold text-white mb-4'>All Profits</h2>

			<input
				type='text'
				placeholder='Search profits...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='input-dark mb-4'
			/>

			<div className='table-wrap scrollbar-hide'>
				<table className='table-base'>
					<thead className='table-head'>
						<tr>
							<th className='px-3 py-2 whitespace-nowrap'>#</th>
							{Object.keys(dummyProfits[0])
								.filter((key) => key !== 'id')
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
						{filtered.map((profit, idx) => (
							<tr
								key={profit.id}
								className='table-row'>
								<td className='px-3 py-2'>{idx + 1}</td>
								{Object.keys(profit)
									.filter((k) => k !== 'id')
									.map((key, i) => (
										<td
											key={i}
											className='px-3 py-2 whitespace-nowrap'>
											{profit[key]}
										</td>
									))}
								<td className='px-3 py-2 whitespace-nowrap'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteProfit(profit.id))}>
										Delete Profit
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

export default ProfitsTable;


