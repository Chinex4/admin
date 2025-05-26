import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addStaking,
	updateStaking,
	clearStakingModal,
} from '../../slices/stakingSlice';

const StakingModal = () => {
	const dispatch = useDispatch();
	const { selectedStaking, stakingModalType } = useSelector(
		(state) => state.staking
	);

	const [form, setForm] = useState({
		name: '',
		apy: '',
		description: '',
		minAmount: '',
		maxAmount: '',
	});

	useEffect(() => {
		if (selectedStaking) setForm(selectedStaking);
	}, [selectedStaking]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = () => {
		if (stakingModalType === 'edit') {
			dispatch(updateStaking(form));
		} else {
			dispatch(addStaking({ ...form, id: Date.now() }));
		}
		dispatch(clearStakingModal());
	};

	return (
		<Transition
			appear
			show={!!stakingModalType}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={() => dispatch(clearStakingModal())}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					leave='ease-in duration-200'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black/60' />
				</Transition.Child>
				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-full p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							leave='ease-in duration-200'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel className='w-full max-w-md p-6 bg-[#1a1a1a] text-white rounded-lg'>
								<Dialog.Title className='text-lg font-bold mb-4'>
									{stakingModalType === 'edit'
										? 'Edit Staking'
										: 'Add New Staking'}
								</Dialog.Title>
								{['name', 'apy', 'description', 'minAmount', 'maxAmount'].map(
									(field) => (
										<input
											key={field}
											name={field}
											value={form[field]}
											onChange={handleChange}
											placeholder={field}
											className='w-full mb-3 px-4 py-2 rounded bg-[#2b2b2b] border border-gray-700'
										/>
									)
								)}
								<div className='flex justify-end space-x-2 mt-4'>
									<button
										onClick={() => dispatch(clearStakingModal())}
										className='px-4 py-2 bg-red-600 rounded'>
										Cancel
									</button>
									<button
										onClick={handleSubmit}
										className='px-4 py-2 bg-green-600 rounded'>
										Save
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default StakingModal;
