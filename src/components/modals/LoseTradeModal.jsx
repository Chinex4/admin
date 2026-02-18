import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment } from 'react';
import {
	clearTradeModal,
	setTradeActionError,
} from '../../slices/tradeSlice';
import { showError } from '../../utils/toast';
import { lossTradeOrder } from '../../redux/thunks/tradeActionsThunk';

const LoseTradeModal = () => {
	const dispatch = useDispatch();
	const { selectedTrade, actionError, actionLoading } = useSelector((state) => state.trades);
	const [amount, setAmount] = useState('');

	const handleConfirm = async () => {
		const tradeId = selectedTrade?.orderId ?? selectedTrade?.id;
		if (!tradeId) {
			dispatch(setTradeActionError('No trade selected.'));
			showError('No trade selected.');
			return;
		}
		if (!String(amount).trim()) {
			dispatch(setTradeActionError('Loss amount is required.'));
			showError('Loss amount is required.');
			return;
		}
		try {
			await dispatch(
				lossTradeOrder({ tradeId, amount: String(amount).trim() })
			).unwrap();
			dispatch(setTradeActionError(null));
			dispatch(clearTradeModal());
		} catch (err) {
			dispatch(setTradeActionError(typeof err === 'string' ? err : 'Failed to mark trade as loss'));
			showError(typeof err === 'string' ? err : 'Failed to mark trade as loss');
		}
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
									Add Loss Amount
								</Dialog.Title>
								<input
									type='number'
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder='Enter amount'
									className='input-dark mt-4'
								/>
								{actionError ? (
									<p className='mt-2 text-xs text-red-400'>{actionError}</p>
								) : null}
								<div className='flex justify-end mt-6 gap-3'>
									<button
										onClick={() => dispatch(clearTradeModal())}
										className='bg-red-600 px-4 py-2 rounded'>
										Cancel
									</button>
									<button
										onClick={handleConfirm}
										disabled={actionLoading}
										className='bg-yellow-600 px-4 py-2 rounded'>
										{actionLoading ? 'Saving...' : 'Confirm'}
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

export default LoseTradeModal;





