import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { showSuccess } from '../../utils/toast';
import axiosInstance from '../../utils/axiosInstance';
import { setWallets } from '../../slices/walletSlice';
import { updateWallet, addWallet } from '../../redux/thunks/walletsThunk'; // change to addWallet if needed

const AddWalletModal = ({ isOpen, onClose }) => {
	const dispatch = useDispatch();
	const [wallet, setWallet] = useState({
		coin_id: '',
		symbol: '',
		name: '',
		networks: [],
	});

	const handleSave = async () => {
		try {
			await dispatch(addWallet(wallet)).unwrap(); // replace with addWallet if available
			showSuccess('Wallet added successfully');

			const res = await axiosInstance.get('admin/fetchWallets');
			dispatch(setWallets(res?.data?.message));

			onClose();
		} catch (error) {
			console.error('Add wallet failed:', error);
		}
	};

	return (
		<Transition
			appear
			show={isOpen}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black/70' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<Dialog.Panel className='w-full max-w-2xl transform overflow-hidden rounded-xl bg-[#1f1f1f] p-6 text-white shadow-xl transition-all'>
								<Dialog.Title className='text-lg font-semibold mb-4'>
									Add Wallet
								</Dialog.Title>

								<div className='space-y-4'>
									{['coin_id', 'symbol', 'name'].map((field) => (
										<div key={field}>
											<label className='block mb-1 text-sm capitalize'>
												{field}
											</label>
											<input
												type='text'
												value={wallet[field]}
												onChange={(e) =>
													setWallet((prev) => ({
														...prev,
														[field]: e.target.value,
													}))
												}
												className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
											/>
										</div>
									))}

									<h3 className='text-md font-semibold'>Networks</h3>
									{(wallet.networks || []).map((net, index) => (
										<div
											key={index}
											className='border border-gray-700 p-4 rounded-md space-y-2'>
											<div>
												<label className='block text-sm mb-1'>
													Network Name
												</label>
												<input
													type='text'
													value={net.name}
													onChange={(e) => {
														const updated = [...wallet.networks];
														updated[index].name = e.target.value;
														setWallet({ ...wallet, networks: updated });
													}}
													className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
												/>
											</div>
											<div>
												<label className='block text-sm mb-1'>
													Deposit Address
												</label>
												<input
													type='text'
													value={net.deposit_address}
													onChange={(e) => {
														const updated = [...wallet.networks];
														updated[index].deposit_address = e.target.value;
														setWallet({ ...wallet, networks: updated });
													}}
													className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
												/>
											</div>
											<div className='flex gap-4'>
												<div className='flex-1'>
													<label className='block text-sm mb-1'>
														Confirmations
													</label>
													<input
														type='number'
														value={net.confirmations_required}
														onChange={(e) => {
															const updated = [...wallet.networks];
															updated[index].confirmations_required = Number(
																e.target.value
															);
															setWallet({ ...wallet, networks: updated });
														}}
														className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
													/>
												</div>
												<div className='flex-1'>
													<label className='block text-sm mb-1'>
														Min Deposit
													</label>
													<input
														type='text'
														value={net.min_deposit}
														onChange={(e) => {
															const updated = [...wallet.networks];
															updated[index].min_deposit = e.target.value;
															setWallet({ ...wallet, networks: updated });
														}}
														className='w-full bg-zinc-900 border border-gray-700 px-3 py-2 rounded-md text-sm'
													/>
												</div>
											</div>
											<button
												onClick={() => {
													const updated = wallet.networks.filter(
														(_, i) => i !== index
													);
													setWallet({ ...wallet, networks: updated });
												}}
												className='text-sm text-red-400 hover:underline mt-2'>
												Remove Network
											</button>
										</div>
									))}

									<button
										onClick={() =>
											setWallet((prev) => ({
												...prev,
												networks: [
													...(prev.networks || []),
													{
														name: '',
														deposit_address: '',
														confirmations_required: 1,
														min_deposit: '',
													},
												],
											}))
										}
										className='mt-2 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-sm'>
										+ Add Network
									</button>
								</div>

								<div className='mt-6 flex justify-end space-x-2'>
									<button
										onClick={onClose}
										className='px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm'>
										Cancel
									</button>
									<button
										onClick={handleSave}
										className='px-4 py-2 bg-lime-600 rounded hover:bg-lime-500 text-sm'>
										Save Wallet
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

export default AddWalletModal;
