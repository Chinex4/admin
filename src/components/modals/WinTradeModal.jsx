import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment } from 'react';
import { updateTradeOutcome, clearTradeModal } from '../../slices/tradeSlice';

const WinTradeModal = () => {
	const dispatch = useDispatch();
	const { selectedTrade } = useSelector((state) => state.trades);
	const [amount, setAmount] = useState('');

	const handleConfirm = () => {
		dispatch(
			updateTradeOutcome({ id: selectedTrade.id, outcome: `Won: ${amount}` })
		);
		dispatch(clearTradeModal());
	};

	return (
		<Transition
			appear
			show={true}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-20'
				onClose={() => dispatch(clearTradeModal())}>
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
					<div className='flex items-center justify-center min-h-full p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							leave='ease-in duration-200'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel className='modal-panel p-6 rounded-xl w-full max-w-md'>
								<Dialog.Title className='text-lg font-bold'>
									Add Win Amount
								</Dialog.Title>
								<input
									type='number'
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder='Enter amount'
									className='input-dark mt-4'
								/>
								<div className='flex justify-end mt-6 gap-3'>
									<button
										onClick={() => dispatch(clearTradeModal())}
										className='bg-red-600 px-4 py-2 rounded'>
										Cancel
									</button>
									<button
										onClick={handleConfirm}
										className='bg-green-600 px-4 py-2 rounded'>
										Confirm
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

export default WinTradeModal;





