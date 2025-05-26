import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { clearWithdrawModal, updateWithdraw } from '../../slices/withdrawSlice';

const EditWithdrawModal = () => {
	const { selectedWithdraw } = useSelector((state) => state.withdrawals);
	const dispatch = useDispatch();
	const [form, setForm] = useState({ ...selectedWithdraw });

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSave = () => {
		dispatch(updateWithdraw(form));
		dispatch(clearWithdrawModal());
	};

	return (
		<Transition
			appear
			show={true}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-20'
				onClose={() => dispatch(clearWithdrawModal())}>
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
							<Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-xl bg-[#1a1a1a] p-6 text-white shadow-xl transition-all'>
								<Dialog.Title className='text-lg font-bold mb-4'>
									Edit Withdrawal Details
								</Dialog.Title>
								<div className='grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto'>
									{Object.keys(form)
										.filter((k) => k !== 'id')
										.map((key) => (
											<div
												key={key}
												className='flex flex-col'>
												<label className='text-sm capitalize'>{key}</label>
												<input
													type='text'
													name={key}
													value={form[key]}
													onChange={handleChange}
													className='bg-[#2a2a2a] text-white rounded px-2 py-1'
												/>
											</div>
										))}
								</div>
								<div className='flex justify-end mt-6 gap-3'>
									<button
										onClick={() => dispatch(clearWithdrawModal())}
										className='bg-red-600 px-4 py-2 rounded'>
										Cancel
									</button>
									<button
										onClick={handleSave}
										className='bg-green-600 px-4 py-2 rounded'>
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

export default EditWithdrawModal;
