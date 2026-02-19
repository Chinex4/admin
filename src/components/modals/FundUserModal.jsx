import React, { useEffect, useMemo, useRef, useState } from 'react';
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
	const [symbol, setSymbol] = useState('');
	const [network, setNetwork] = useState('');
	const [account, setAccount] = useState('spotAccount');
	const [note, setNote] = useState('');
	const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);
	const [coinSearch, setCoinSearch] = useState('');
	const coinDropdownRef = useRef(null);

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

	const parseBalances = (value) => {
		if (Array.isArray(value)) return value;
		if (!value) return [];
		if (typeof value === 'object') {
			return Array.isArray(value?.balances) ? value.balances : [];
		}
		if (typeof value !== 'string') return [];
		try {
			const parsed = JSON.parse(value);
			if (Array.isArray(parsed)) return parsed;
			return Array.isArray(parsed?.balances) ? parsed.balances : [];
		} catch {
			return [];
		}
	};

	const formatDecimal = (value, maxDecimals = 12) => {
		if (!Number.isFinite(value)) return '';
		return value.toFixed(maxDecimals).replace(/\.?0+$/, '');
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

	useEffect(() => {
		setAccount('spotAccount');
	}, [selectedUser?.accToken]);

	useEffect(() => {
		setCoinSearch('');
		setCoinDropdownOpen(false);
	}, [selectedUser?.accToken]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!coinDropdownRef.current) return;
			if (!coinDropdownRef.current.contains(event.target)) {
				setCoinDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const selectedWallet = useMemo(() => {
		const normalized = String(symbol || '').toUpperCase();
		return wallets.find((w) => String(w?.symbol || '').toUpperCase() === normalized);
	}, [wallets, symbol]);

	const userBalances = useMemo(() => {
		const balancesSource =
			selectedUser?.balances_json ??
			selectedUser?.balancesJson ??
			selectedUser?.balances;
		return parseBalances(balancesSource);
	}, [selectedUser]);

	const userBalanceLookup = useMemo(() => {
		const byId = new Map();
		const bySymbol = new Map();

		userBalances.forEach((entry) => {
			const entryId = String(entry?.id || entry?.coin_id || '')
				.trim()
				.toLowerCase();
			const entrySymbol = String(entry?.symbol || entry?.coin_symbol || '')
				.trim()
				.toLowerCase();
			const parsedBalance = Number(entry?.balance);
			const normalizedBalance =
				Number.isFinite(parsedBalance) && parsedBalance > 0 ? parsedBalance : 0;

			if (entryId) byId.set(entryId, normalizedBalance);
			if (entrySymbol) bySymbol.set(entrySymbol, normalizedBalance);
		});

		return { byId, bySymbol };
	}, [userBalances]);

	const orderedWallets = useMemo(() => {
		const getWalletBalance = (wallet) => {
			const walletCoinId = String(wallet?.coin_id || '')
				.trim()
				.toLowerCase();
			const walletSymbol = String(wallet?.symbol || '')
				.trim()
				.toLowerCase();
			if (walletCoinId && userBalanceLookup.byId.has(walletCoinId)) {
				return userBalanceLookup.byId.get(walletCoinId);
			}
			if (walletSymbol && userBalanceLookup.bySymbol.has(walletSymbol)) {
				return userBalanceLookup.bySymbol.get(walletSymbol);
			}
			return 0;
		};

		return [...wallets].sort((a, b) => {
			const balanceDiff = getWalletBalance(b) - getWalletBalance(a);
			if (balanceDiff !== 0) return balanceDiff;

			const symbolA = String(a?.symbol || '');
			const symbolB = String(b?.symbol || '');
			return symbolA.localeCompare(symbolB, undefined, { sensitivity: 'base' });
		});
	}, [wallets, userBalanceLookup]);

	const filteredWallets = useMemo(() => {
		const query = String(coinSearch || '')
			.trim()
			.toLowerCase();
		if (!query) return orderedWallets;

		return orderedWallets.filter((wallet) => {
			const walletSymbol = String(wallet?.symbol || '')
				.trim()
				.toLowerCase();
			const walletName = String(wallet?.name || '')
				.trim()
				.toLowerCase();
			const walletCoinId = String(wallet?.coin_id || '')
				.trim()
				.toLowerCase();
			return (
				walletSymbol.includes(query) ||
				walletName.includes(query) ||
				walletCoinId.includes(query)
			);
		});
	}, [orderedWallets, coinSearch]);

	const selectedCoinLabel = useMemo(() => {
		if (!symbol) return 'Choose coin';
		const matchedWallet = orderedWallets.find(
			(wallet) => String(wallet?.symbol || '').toUpperCase() === symbol
		);
		if (!matchedWallet) return symbol;
		const coinSymbol = String(matchedWallet?.symbol || '').toUpperCase();
		return matchedWallet?.name ? `${coinSymbol} (${matchedWallet.name})` : coinSymbol;
	}, [orderedWallets, symbol]);

	const selectedCoinPriceUsd = useMemo(() => {
		const coinId = String(selectedWallet?.coin_id || '')
			.trim()
			.toLowerCase();
		const normalizedSymbol = String(symbol || '')
			.trim()
			.toLowerCase();

		const matchedBalance = userBalances.find((entry) => {
			const entryId = String(entry?.id || entry?.coin_id || '')
				.trim()
				.toLowerCase();
			const entrySymbol = String(entry?.symbol || entry?.coin_symbol || '')
				.trim()
				.toLowerCase();
			return (coinId && entryId === coinId) || (normalizedSymbol && entrySymbol === normalizedSymbol);
		});
		const parsedPrice = Number(matchedBalance?.price);
		if (Number.isFinite(parsedPrice) && parsedPrice > 0) {
			return parsedPrice;
		}

		const stableSymbols = ['usd', 'usdt', 'usdc', 'busd', 'fdusd', 'dai', 'tusd'];
		if (stableSymbols.includes(normalizedSymbol)) {
			return 1;
		}

		return null;
	}, [userBalances, selectedWallet, symbol]);

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
	const calculatedCoinAmount = useMemo(() => {
		const parsedUsd = Number(amountUsd);
		if (!Number.isFinite(parsedUsd) || parsedUsd <= 0) return '';
		if (!Number.isFinite(selectedCoinPriceUsd) || selectedCoinPriceUsd <= 0) return '';
		return formatDecimal(parsedUsd / selectedCoinPriceUsd, 12);
	}, [amountUsd, selectedCoinPriceUsd]);

	const handleFund = () => {
		const parsedAmount = Number(amountUsd);
		const parsedCoinAmount = Number(calculatedCoinAmount);
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
		if (!Number.isFinite(selectedCoinPriceUsd) || selectedCoinPriceUsd <= 0) {
			showError('Conversion price unavailable for selected coin');
			return;
		}
		if (!Number.isFinite(parsedCoinAmount) || parsedCoinAmount <= 0) {
			showError('Calculated coin amount is invalid');
			return;
		}

		const payload = {
			accToken: selectedUser.accToken,
			symbol,
			network,
			amount_usd: String(parsedAmount),
			coin_amount: formatDecimal(Math.abs(parsedCoinAmount), 12),
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
											<div
												className='relative'
												ref={coinDropdownRef}>
												<button
													type='button'
													onClick={() =>
														!walletsLoading &&
														orderedWallets.length > 0 &&
														setCoinDropdownOpen((prev) => !prev)
													}
													className='input-dark w-full text-left flex items-center justify-between'
													disabled={walletsLoading}>
													<span>{selectedCoinLabel}</span>
													<span className='muted-text'>{coinDropdownOpen ? '▴' : '▾'}</span>
												</button>

												{coinDropdownOpen && (
													<div className='absolute z-50 mt-2 w-full rounded-lg border border-slate-700 bg-[#061428] shadow-xl'>
														<div className='sticky top-0 z-10 p-2 border-b border-slate-700 bg-[#061428]'>
															<input
																type='text'
																value={coinSearch}
																onChange={(e) => setCoinSearch(e.target.value)}
																className='input-dark w-full'
																placeholder='Search coin'
																autoFocus
															/>
														</div>
														<div className='max-h-64 overflow-y-auto py-1'>
															<button
																type='button'
																className='w-full text-left px-4 py-2 hover:bg-blue-700/30'
																onClick={() => {
																	setSymbol('');
																	setCoinDropdownOpen(false);
																}}>
																Choose coin
															</button>
															{filteredWallets.map((w) => {
																const value = String(w?.symbol || '').toUpperCase();
																const label = `${value} ${w?.name ? `(${w.name})` : ''}`;
																return (
																	<button
																		type='button'
																		key={w?.id || value}
																		className='w-full text-left px-4 py-2 hover:bg-blue-700/30'
																		onClick={() => {
																			setSymbol(value);
																			setCoinDropdownOpen(false);
																		}}>
																		{label}
																	</button>
																);
															})}
															{filteredWallets.length === 0 && (
																<p className='px-4 py-2 muted-text text-xs'>
																	No coins match your search
																</p>
															)}
														</div>
													</div>
												)}
											</div>
											{!walletsLoading && orderedWallets.length === 0 && (
												<p className='muted-text text-xs mt-1'>No coins available</p>
											)}
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
												value={calculatedCoinAmount}
												readOnly
												className='input-dark'
												placeholder='Auto-calculated from USD'
											/>
											<p className='muted-text text-xs mt-1'>
												{Number.isFinite(selectedCoinPriceUsd) && selectedCoinPriceUsd > 0
													? `1 ${symbol || 'COIN'} = $${formatDecimal(selectedCoinPriceUsd, 8)}`
													: 'Conversion price unavailable'}
											</p>
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




