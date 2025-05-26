import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWallets, deleteWallet } from '../../slices/walletSlice';

const dummyWallets = [
	{
		id: 1,
		BTC: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		BTCChain: 'Bitcoin',
		ETH: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
		ETHChain: 'ERC20',
		USDT: 'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
		USDTChain: 'TRC20',
		XRP: 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
		XRPChain: 'XRP Ledger',
		BNB: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbb',
		BNBChain: 'BEP20',
		SOL: 'sssssssssssssssssssssssssssssssssss',
		SOLChain: 'SOL',
		DOGE: 'dddddddddddddddddddddddddddddddddddd',
		DOGEChain: 'DOGE',
		USDC: 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
		USDCChain: 'BEP20',
		LDO: 'nkm,mmmmmmmmmmm',
		LDOChain: 'Lido',
		ADA: 'ccccccccccccccccccccccccccccccccccccccccccccccctr',
		ADAChain: 'ADA',
		TRX: 'trtrtrtttrrtrtrtrtrrtrtrtrtrttrtrtrtrtrtrtrtrtrtrtrrttrrtrttrrtrtrrt',
		TRXChain: 'TRC20',
		AVAX: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		AVAXChain: 'AVAX',
		LINK: 'ccccccccccccccccccccccccccccccccccccccccccc',
		LINKChain: 'ERC20',
		WSTETH: 'wwwwwwwwwwwwwwsssssssssseeeeeeeeeee',
		WSTETHChain: 'ERC20',
		TON: 'ttttttttooooonnnnn',
		TONChain: 'TON',
		WBTC: 'wwwwwwwwwwbbbbbbbbb',
		WBTCChain: 'ERC20',
		SHIB: 'jnjnkjnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjnnnn',
		SHIBChain: 'ERC20',
		XLM: 'sssssssssssssssss',
		XLMChain: 'XLM',
		DOT: 'ppppppppppppppppp',
		DOTChain: 'DOT',
		DJT: 'trpppppppppppppppppppppppp',
		DJTChain: 'TRUMP',
	},
];

const WalletsTable = () => {
	const dispatch = useDispatch();
	const { wallets } = useSelector((state) => state.wallets);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setWallets(dummyWallets));
	}, [dispatch]);

	const filtered = wallets.filter((wallet) =>
		Object.values(wallet).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	const columnKeys = Object.keys(dummyWallets[0]).filter((k) => k !== 'id');

	return (
		<div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
			<h2 className='text-xl font-semibold text-white mb-4'>User Wallets</h2>
			<input
				type='text'
				placeholder='Search wallets...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
			/>
			<div className='overflow-x-auto rounded-xl'>
				<table className='table-auto text-sm text-left text-white w-full'>
					<thead className='bg-[#121212] text-gray-300'>
						<tr>
							<th className='px-3 py-2'>#</th>
							{columnKeys.map((key, idx) => (
								<th
									key={idx}
									className='px-3 py-2 whitespace-nowrap'>
									{key}
								</th>
							))}
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((wallet, idx) => (
							<tr
								key={wallet.id}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								<td className='px-3 py-2'>{idx + 1}</td>
								{columnKeys.map((key, i) => (
									<td
										key={i}
										className='px-3 py-2 whitespace-nowrap'>
										{wallet[key]}
									</td>
								))}
								<td className='px-3 py-2 whitespace-nowrap'>
									<button
										onClick={() => dispatch(deleteWallet(wallet.id))}
										className='bg-red-600 px-3 py-1 rounded text-sm'>
										Delete Wallet
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default WalletsTable;
