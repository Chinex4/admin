import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setCopies,
	deleteCopy,
	approveCopy,
	disapproveCopy,
} from '../../slices/activateCopySlice';

const dummyCopies = [
	{
		id: 1,
		username: 'fname lname',
		code: 'BTB888999139YT',
		status: null,
	},
];

const ActivateCopyTable = () => {
	const dispatch = useDispatch();
	const { copies } = useSelector((state) => state.activateCopy);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setCopies(dummyCopies));
	}, [dispatch]);

	const filtered = copies.filter((copy) =>
		Object.values(copy).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 panel panel-pad'>
			<h2 className='text-xl font-semibold text-white mb-4'>Activate Copy</h2>

			<input
				type='text'
				placeholder='Search copies...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='input-dark mb-4'
			/>

			<div className='table-wrap scrollbar-hide'>
				<table className='table-base'>
					<thead className='table-head'>
						<tr>
							<th className='px-3 py-2'>#</th>
							<th className='px-3 py-2'>Username</th>
							<th className='px-3 py-2'>Code</th>
							<th className='px-3 py-2'>Status</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((copy, idx) => (
							<tr
								key={copy.id}
								className='table-row'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{copy.username}</td>
								<td className='px-3 py-2'>{copy.code}</td>
								<td className='px-3 py-2'>{copy.status || 'Pending'}</td>
								<td className='px-3 py-2 whitespace-nowrap space-x-1'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteCopy(copy.id))}>
										Delete Copy
									</button>
									<button
										className='bg-green-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(approveCopy(copy.id))}>
										Approve Copy
									</button>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(disapproveCopy(copy.id))}>
										Disapprove Copy
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

export default ActivateCopyTable;


