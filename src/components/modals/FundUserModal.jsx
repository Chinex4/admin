import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { clearModal } from '../../slices/userSlice';
import axiosInstance from '../../utils/axiosInstance';
import { showError, showPromise } from '../../utils/toast';
import { fundUserAccount } from '../../redux/thunks/usersThunk';
import { fetchUsers } from '../../slices/fetchSlice';

const FundUserModal = () => {
	const { selectedUser } = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const [wallets, setWallets] = useState([]);
	const [walletsLoading, setWalletsLoading] = useState(false);
	const [amountUsd, setAmountUsd] = useState('');
	const [coinAmount, setCoinAmount] = useState('');
	const [symbol, setSymbol] = useState('');
	const [network, setNetwork] = useState('');
	const [account, setAccount] = useState('spotAccount');
	const [note, setNote] = useState('');

	const parseList = (value) => {
		if (Array.isArray(value)) {
			return value.map((v) => String(v).trim()).filter(Boolean);
		}
		if (typeof value !== 'string') return [];
		const trimmed = value.trim();
		if (!trimmed) return [];
		try {
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed)) {
				return parsed.map((v) => String(v).trim()).filter(Boolean);
			}
		} catch {
			// ignore parsing fallback
		}
		if (trimmed.includes(',')) {
			return trimmed
				.split(',')
				.map((v) => v.trim())
				.filter(Boolean);
		}
		return [trimmed];
	};

	useEffect(() => {
		const loadWallets = async () => {
			setWalletsLoading(true);
			try {
				const res = await axiosInstance.get('admin/fetchWallets');
				const payload = res?.data?.message;
				const nextWallets = Array.isArray(payload)
					? payload
					: Array.isArray(payload?.wallets)
						? payload.wallets
						: [];
				setWallets(nextWallets);

				if (nextWallets.length > 0) {
					const first = nextWallets[0];
					const firstSymbol = String(first?.symbol || '').toUpperCase();
					setSymbol((prev) => prev || firstSymbol);
				}
			} catch {
				showError('Failed to load wallet details');
			} finally {
				setWalletsLoading(false);
			}
		};

		loadWallets();
	}, []);

	const selectedWallet = useMemo(() => {
		const normalized = String(symbol || '').toUpperCase();
		return wallets.find((w) => String(w?.symbol || '').toUpperCase() === normalized);
	}, [wallets, symbol]);

	const networkOptions = useMemo(() => {
		const fromField = parseList(selectedWallet?.network);
		if (fromField.length > 0) return fromField;
		if (selectedWallet?.coin_id) return [String(selectedWallet.coin_id)];
		return [];
	}, [selectedWallet]);

	useEffect(() => {
		if (!networkOptions.length) {
			setNetwork('');
			return;
		}
		if (!network || !networkOptions.includes(network)) {
			setNetwork(networkOptions[0]);
		}
	}, [networkOptions, network]);

	const selectedNetworkIndex = Math.max(networkOptions.indexOf(network), 0);
	const addresses = parseList(selectedWallet?.deposit_address);
	const minDeposits = parseList(selectedWallet?.min_deposit);
	const confirmations = parseList(selectedWallet?.confirmations_required);

	const depositAddress =
		addresses[selectedNetworkIndex] || addresses[0] || 'Not available';
	const minDeposit =
		minDeposits[selectedNetworkIndex] || minDeposits[0] || 'Not available';
	const confirmationText =
		confirmations[selectedNetworkIndex] || confirmations[0] || 'Not available';

	const handleFund = () => {
		const parsedAmount = Number(amountUsd);
		if (!selectedUser?.accToken) {
			showError('No selected user');
			return;
		}
		if (!symbol) {
			showError('Select a coin');
			return;
		}
		if (!network) {
			showError('Select a network');
			return;
		}
		if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
			showError('Enter a valid USD amount');
			return;
		}

		const payload = {
			accToken: selectedUser.accToken,
			symbol,
			network,
			amount_usd: String(parsedAmount),
			coin_amount: coinAmount && Number.isFinite(Number(coinAmount))
				? String(Math.abs(Number(coinAmount)))
				: String(parsedAmount),
			account,
			note: note.trim(),
		};

		const promise = new Promise((resolve, reject) => {
			dispatch(fundUserAccount(payload))
				.unwrap()
				.then((res) => {
					dispatch(fetchUsers());
					dispatch(clearModal());
					resolve(res);
				})
				.catch((err) => reject(err));
		});

		showPromise(promise, {
			loading: 'Funding user account...',
			success: (res) =>
				res?.data?.message?.message || res?.data?.message || 'User funded',
			error: (msg) => msg || 'Failed to fund user',
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
							<Dialog.Panel className='w-full max-w-3xl rounded-xl modal-panel p-6'>
								<Dialog.Title className='text-lg font-bold mb-4'>
									Fund User Wallet
								</Dialog.Title>
								<div className='space-y-4 text-sm'>
									<div className='grid md:grid-cols-2 gap-4'>
										<div>
											<label className='block mb-1'>Select coin</label>
											<select
												value={symbol}
												onChange={(e) => setSymbol(e.target.value)}
												className='input-dark'
												disabled={walletsLoading}>
												<option value=''>Choose coin</option>
												{wallets.map((w) => {
													const value = String(w?.symbol || '').toUpperCase();
													const label = `${value} ${w?.name ? `(${w.name})` : ''}`;
													return (
														<option
															key={w?.id || value}
															value={value}>
															{label}
														</option>
													);
												})}
											</select>
										</div>
										<div>
											<label className='block mb-1'>Select network</label>
											<select
												value={network}
												onChange={(e) => setNetwork(e.target.value)}
												className='input-dark'
												disabled={!networkOptions.length}>
												<option value=''>Choose network</option>
												{networkOptions.map((net) => (
													<option
														key={net}
														value={net}>
														{net}
													</option>
												))}
											</select>
										</div>
									</div>

									<div className='grid md:grid-cols-2 gap-4'>
										<div>
											<label className='block mb-1'>Amount (USD)</label>
											<input
												type='number'
												value={amountUsd}
												onChange={(e) => setAmountUsd(e.target.value)}
												className='input-dark'
												placeholder='0.00'
											/>
										</div>
										<div>
											<label className='block mb-1'>
												Amount ({symbol || 'COIN'})
											</label>
											<input
												type='number'
												value={coinAmount}
												onChange={(e) => setCoinAmount(e.target.value)}
												className='input-dark'
												placeholder='Auto uses USD amount if empty'
											/>
										</div>
									</div>

									<div>
										<label className='block mb-1'>Deposit to account</label>
										<select
											value={account}
											onChange={(e) => setAccount(e.target.value)}
											className='input-dark'>
											<option value='spotAccount'>Spot Account</option>
											<option value='futureAccount'>Future Account</option>
											<option value='earnAccount'>Earn Account</option>
											<option value='copyAccount'>Copy Account</option>
										</select>
									</div>

									<div>
										<label className='block mb-1'>Details</label>
										<div className='card-subtle p-4 space-y-3'>
											<div>
												<p className='muted-text text-xs'>Deposit address</p>
												<p className='break-all'>{depositAddress}</p>
											</div>
											<div className='flex justify-between text-xs md:text-sm'>
												<span>Min. deposit</span>
												<span>{minDeposit}</span>
											</div>
											<div className='flex justify-between text-xs md:text-sm'>
												<span>Confirmations</span>
												<span>{confirmationText}</span>
											</div>
										</div>
									</div>

									<div>
										<label className='block mb-1'>Admin note (optional)</label>
										<textarea
											rows='3'
											value={note}
											onChange={(e) => setNote(e.target.value)}
											className='input-dark'
										/>
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




