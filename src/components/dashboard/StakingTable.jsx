import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setStakings,
	deleteStaking,
	setSelectedStaking,
	setStakingModalType,
} from '../../slices/stakingSlice';
import StakingModal from '../modals/StakingModal';

const dummyStakings = [
	{
		id: 1,
		name: 'GREATEST STAKING',
		apy: '6.5% After 1 day',
		description: 'DDSSDSDDS',
		minAmount: 1000,
		maxAmount: 25000,
	},
	{
		id: 2,
		name: 'VIP STAKING',
		apy: '7.5',
		description: 'Binance Coin staking made easy with high returns',
		minAmount: 100000,
		maxAmount: 150000,
	},
	{
		id: 3,
		name: 'PROFESSIONAL STAKING',
		apy: '6.5',
		description: 'Binance Coin staking made easy with high returns.',
		minAmount: 50000,
		maxAmount: 100000,
	},
	{
		id: 4,
		name: 'STANDARD STAKING',
		apy: '4.7',
		description: 'Stake Ethereum and enjoy competitive APY rates.',
		minAmount: 1500,
		maxAmount: 50000,
	},
];

const StakingTable = () => {
	const dispatch = useDispatch();
	const { stakings } = useSelector((state) => state.staking);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setStakings(dummyStakings));
	}, [dispatch]);

	const filtered = stakings.filter((s) =>
		Object.values(s).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	const openModal = (type, staking = null) => {
		if (staking) dispatch(setSelectedStaking(staking));
		dispatch(setStakingModalType(type));
	};

	return (
		<div className='mt-6 panel panel-pad'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-semibold text-white'>Staking Plans</h2>
				<button
					onClick={() => openModal('add')}
					className='bg-green-600 text-sm px-4 py-2 rounded'>
					+ Add Staking
				</button>
			</div>

			<input
				type='text'
				placeholder='Search staking...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='input-dark mb-4'
			/>

			<div className='table-wrap scrollbar-hide'>
				<table className='table-base'>
					<thead className='table-head'>
						<tr>
							<th className='px-3 py-2'>#</th>
							<th className='px-3 py-2'>Name</th>
							<th className='px-3 py-2'>APY</th>
							<th className='px-3 py-2'>Description</th>
							<th className='px-3 py-2'>Min</th>
							<th className='px-3 py-2'>Max</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((stake, idx) => (
							<tr
								key={stake.id}
								className='table-row'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{stake.name}</td>
								<td className='px-3 py-2'>{stake.apy}</td>
								<td className='px-3 py-2'>{stake.description}</td>
								<td className='px-3 py-2'>{stake.minAmount}</td>
								<td className='px-3 py-2'>{stake.maxAmount}</td>
								<td className='px-3 py-2 space-x-2 whitespace-nowrap'>
									<button
										className='bg-yellow-600 px-3 py-1 rounded text-sm'
										onClick={() => openModal('edit', stake)}>
										Edit
									</button>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteStaking(stake.id))}>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<StakingModal />
		</div>
	);
};

export default StakingTable;


