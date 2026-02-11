import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { clearModal } from '../../slices/userSlice';

const AddProfitModal = () => {
	const { selectedUser } = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const [profit, setProfit] = useState('');

	const handleAdd = () => {
		const updatedProfit = (
			parseFloat(selectedUser.profit || 0) + parseFloat(profit)
		).toFixed(2);
		// dispatch(updateUser({ ...selectedUser, profit: updatedProfit }));
		dispatch(clearModal());
	};

	return (
		<Transition
			appear
			show={true}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-20'
				onClose={() => dispatch(clearModal())}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					leave='ease-in duration-200'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black bg-opacity-50' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							leave='ease-in duration-200'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel className='w-full max-w-md rounded-xl modal-panel p-6'>
								<Dialog.Title className='text-lg font-bold mb-4'>
									Add Profit
								</Dialog.Title>
								<input
									type='number'
									value={profit}
									onChange={(e) => setProfit(e.target.value)}
									className='input-dark'
								/>
								<div className='flex justify-end gap-3 mt-6'>
									<button
										className='bg-red-600 px-4 py-2 rounded'
										onClick={() => dispatch(clearModal())}>
										Cancel
									</button>
									<button
										className='bg-green-600 px-4 py-2 rounded'
										onClick={handleAdd}>
										Add
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

export default AddProfitModal;




