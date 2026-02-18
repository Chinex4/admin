import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { clearModal } from '../../slices/userSlice';
import { updateUser } from '../../redux/thunks/usersThunk';
import { fetchUsers } from '../../slices/fetchSlice';
import { showError, showPromise } from '../../utils/toast';

const ChangeSignalModal = () => {
	const { selectedUser } = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const [signalMsg, setSignalMsg] = useState(
		selectedUser?.SignalMessage || selectedUser?.signalMsg || ''
	);

	const handleSave = () => {
		if (!selectedUser?.accToken) {
			showError('No selected user');
			return;
		}

		const promise = new Promise((resolve, reject) => {
			dispatch(
				updateUser({
					accToken: selectedUser.accToken,
					SignalMessage: signalMsg,
				})
			)
				.unwrap()
				.then((res) => {
					dispatch(fetchUsers());
					dispatch(clearModal());
					resolve(res);
				})
				.catch((err) => reject(err));
		});

		showPromise(promise, {
			loading: 'Updating signal message...',
			success: (res) =>
				res?.data?.message?.message || res?.data?.message || 'Signal updated',
			error: (msg) => msg || 'Failed to update signal message',
		});
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
							<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-xl modal-panel p-6 transition-all'>
								<Dialog.Title className='text-lg font-bold mb-4'>
									Change Signal Message
								</Dialog.Title>
								<textarea
									rows='4'
									className='input-dark'
									value={signalMsg}
									onChange={(e) => setSignalMsg(e.target.value)}
								/>
								<div className='flex justify-end mt-6 gap-3'>
									<button
										onClick={() => dispatch(clearModal())}
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

export default ChangeSignalModal;




