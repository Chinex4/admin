import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLosses, deleteLoss } from '../../slices/lossSlice';

const dummyLosses = [
	{
		id: 1,
		userName: 'fname lname',
		amount: '3480',
		balance: '1020860',
		createdAt: '5/13/2025, 2:30:16 PM',
		token: '46a5ad400018e84a66adefac8273608d',
		transId: '#VvkaDY2KXt',
		transStatus: 'Approved',
		transType: 'Loss',
	},
];

const LossesTable = () => {
	const dispatch = useDispatch();
	const { losses } = useSelector((state) => state.losses);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setLosses(dummyLosses));
	}, [dispatch]);

	const filtered = losses.filter((loss) =>
		Object.values(loss).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 panel panel-pad'>
			<h2 className='text-xl font-semibold text-white mb-4'>All Losses</h2>

			<input
				type='text'
				placeholder='Search losses...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='input-dark mb-4'
			/>

			<div className='table-wrap scrollbar-hide'>
				<table className='table-base'>
					<thead className='table-head'>
						<tr>
							<th className='px-3 py-2 whitespace-nowrap'>#</th>
							{Object.keys(dummyLosses[0])
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
						{filtered.map((loss, idx) => (
							<tr
								key={loss.id}
								className='table-row'>
								<td className='px-3 py-2'>{idx + 1}</td>
								{Object.keys(loss)
									.filter((k) => k !== 'id')
									.map((key, i) => (
										<td
											key={i}
											className='px-3 py-2 whitespace-nowrap'>
											{loss[key]}
										</td>
									))}
								<td className='px-3 py-2 whitespace-nowrap'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteLoss(loss.id))}>
										Delete Loss
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

export default LossesTable;


