import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { clearModal, updateUser } from '../../slices/userSlice';

const FundUserModal = () => {
	const { selectedUser } = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const [amount, setAmount] = useState('');
	const [coin, setCoin] = useState('BTC');

	const coinList = Object.keys(selectedUser.crypto);

	const handleFund = () => {
		const updatedCrypto = {
			...selectedUser.crypto,
			[coin]: (
				parseFloat(selectedUser.crypto[coin]) + parseFloat(amount)
			).toFixed(2),
		};
		dispatch(updateUser({ ...selectedUser, crypto: updatedCrypto }));
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
							<Dialog.Panel className='w-full max-w-md rounded-xl bg-[#1a1a1a] p-6 text-white shadow-xl'>
								<Dialog.Title className='text-lg font-bold mb-4'>
									Fund User Wallet
								</Dialog.Title>
								<div className='space-y-4'>
									<div>
										<label>Amount</label>
										<input
											type='number'
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											className='w-full px-3 py-2 rounded bg-[#2a2a2a]'
										/>
									</div>
									<div>
										<label>Coin</label>
										<select
											value={coin}
											onChange={(e) => setCoin(e.target.value)}
											className='w-full px-3 py-2 rounded bg-[#2a2a2a]'>
											{coinList.map((c) => (
												<option
													key={c}
													value={c}>
													{c}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className='flex justify-end gap-3 mt-6'>
									<button
										className='bg-red-600 px-4 py-2 rounded'
										onClick={() => dispatch(clearModal())}>
										Cancel
									</button>
									<button
										className='bg-green-600 px-4 py-2 rounded'
										onClick={handleFund}>
										Fund
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

export default FundUserModal;
