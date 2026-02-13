import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { showError } from '../../utils/toast';
import { normalizeOrder } from '../../utils/p2p';

const PAGE_SIZE = 10;

const P2POrdersPage = () => {
	const [orders, setOrders] = useState([]);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		setPage(1);
	}, [search]);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			setError('');
			const res = await axiosInstance.get('admin/p2pOrders');
			const payload = res?.data?.message ?? res?.data ?? [];
			const normalized = Array.isArray(payload)
				? payload.map((item, index) => normalizeOrder(item, index))
				: [];
			setOrders(normalized);
		} catch (err) {
			console.error('Failed to fetch P2P orders:', err);
			const msg = 'Failed to fetch P2P orders';
			setError(msg);
			showError(msg);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const columns = useMemo(
		() => [
			'Order ID',
			'User ID',
			'Ad Type',
			'Pair',
			'Fiat Amount',
			'Crypto Amount',
			'Price',
			'Payment',
			'Merchant',
			'Orders',
			'Completion',
			'Limit',
			'Quantity',
			'Status',
			'Created At',
		],
		[]
	);

	const filteredOrders = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return orders;
		return orders.filter((order) =>
			[
				order.orderId,
				order.userId,
				order.merchant,
				order.coin,
				order.fiat,
				order.paymentMethod,
				order.status,
			]
				.join(' ')
				.toLowerCase()
				.includes(q)
		);
	}, [orders, search]);

	const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const pageItems = filteredOrders.slice(
		(safePage - 1) * PAGE_SIZE,
		safePage * PAGE_SIZE
	);

	return (
		<div className='space-y-5'>
			<div className='panel panel-pad'>
				<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
					<div>
						<h2 className='text-xl font-semibold text-white'>P2P Orders</h2>
						<p className='muted-text mt-2'>
							Order list from API endpoint <code>admin/p2pOrders</code>.
						</p>
					</div>
					<input
						type='text'
						placeholder='Search orders...'
						className='input-dark md:max-w-sm'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				{loading ? (
					<p className='muted-text mt-6'>Loading orders...</p>
				) : error ? (
					<div className='mt-6 flex items-center justify-between gap-3 text-red-400'>
						<p>{error}</p>
						<button
							className='button-ghost text-xs'
							onClick={fetchOrders}
						>
							Retry
						</button>
					</div>
				) : (
					<>
						<div className='mt-6 table-wrap scrollbar-hide'>
							<table className='table-base'>
								<thead className='table-head'>
									<tr>
										{columns.map((col) => (
											<th key={col} className='px-3 py-2 whitespace-nowrap'>
												{col}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{pageItems.length === 0 ? (
										<tr className='table-row'>
											<td className='px-3 py-3' colSpan={columns.length}>
												No P2P orders found.
											</td>
										</tr>
									) : (
										pageItems.map((order) => (
											<tr key={order.id ?? order.orderId} className='table-row'>
												<td className='px-3 py-2 whitespace-nowrap'>{order.orderId}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.userId}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.adType}</td>
												<td className='px-3 py-2 whitespace-nowrap'>
													{order.coin}/{order.fiat}
												</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.fiatAmount}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.cryptoAmount}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.price}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.paymentMethod}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.merchant}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.orders}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.completion}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.limitRange}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.quantity}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.status}</td>
												<td className='px-3 py-2 whitespace-nowrap'>{order.createdAt}</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
						<div className='mt-4 flex items-center justify-between text-xs text-slate-200'>
							<span>
								Page {safePage} of {totalPages}
							</span>
							<div className='flex gap-2'>
								<button
									className='button-ghost text-xs'
									disabled={safePage === 1}
									onClick={() => setPage((prev) => Math.max(1, prev - 1))}
								>
									<i className='bi bi-chevron-left' />
								</button>
								<button
									className='button-ghost text-xs'
									disabled={safePage === totalPages}
									onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
								>
									<i className='bi bi-chevron-right' />
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default P2POrdersPage;
