import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setStakingRequests,
	deleteStakingRequest,
	approveStakingRequest,
	disapproveStakingRequest,
} from '../../slices/stakingRequestSlice';

const dummyStakingRequests = [
	{
		id: 1,
		userName: 'fname lname',
		plan: 'BASIC STAKING',
		amount: 4913,
		assets: 'BTC',
		date: '5/15/2025, 11:40:55 PM',
		reward: 196.52,
		status: 'Pending',
		transId: '#pVcMIL2S3F',
	},
	{
		id: 2,
		userName: 'fname lname',
		plan: 'BASIC STAKING',
		amount: 1222,
		assets: 'BTC',
		date: '5/4/2025, 9:10:13 PM',
		reward: 48.88,
		status: 'Disapproved',
		transId: '#RPXTfFjBkb',
	},
	{
		id: 3,
		userName: 'fname lname',
		plan: 'BASIC STAKING',
		amount: 9000,
		assets: 'BTC',
		date: '5/3/2025, 6:44:32 PM',
		reward: 360.0,
		status: 'Pending',
		transId: '#null',
	},
];

const StakingRequestTable = () => {
	const dispatch = useDispatch();
	const { stakingRequests } = useSelector((state) => state.stakingRequests);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setStakingRequests(dummyStakingRequests));
	}, [dispatch]);

	const filtered = stakingRequests.filter((r) =>
		Object.values(r).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 panel panel-pad'>
			<h2 className='text-xl font-semibold text-white mb-4'>
				Staking Requests
			</h2>
			<input
				type='text'
				placeholder='Search staking requests...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='input-dark mb-4'
			/>
			<div className='table-wrap scrollbar-hide'>
				<table className='table-base'>
					<thead className='table-head'>
						<tr>
							<th className='px-3 py-2'>#</th>
							<th className='px-3 py-2'>User Name</th>
							<th className='px-3 py-2'>Plan</th>
							<th className='px-3 py-2'>Amount</th>
							<th className='px-3 py-2'>Assets</th>
							<th className='px-3 py-2'>Date</th>
							<th className='px-3 py-2'>Reward</th>
							<th className='px-3 py-2'>Status</th>
							<th className='px-3 py-2'>Trans ID</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((req, idx) => (
							<tr
								key={req.id}
								className='table-row'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{req.userName}</td>
								<td className='px-3 py-2'>{req.plan}</td>
								<td className='px-3 py-2'>{req.amount}</td>
								<td className='px-3 py-2'>{req.assets}</td>
								<td className='px-3 py-2'>{req.date}</td>
								<td className='px-3 py-2'>{req.reward}</td>
								<td className='px-3 py-2'>{req.status}</td>
								<td className='px-3 py-2'>{req.transId}</td>
								<td className='px-3 py-2 space-x-2 whitespace-nowrap'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteStakingRequest(req.id))}>
										Delete
									</button>
									<button
										className='bg-green-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(approveStakingRequest(req.id))}>
										Approve
									</button>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(disapproveStakingRequest(req.id))}>
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

export default StakingRequestTable;


