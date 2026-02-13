import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { showError, showSuccess } from '../../utils/toast';
import { normalizeOrder } from '../../utils/p2p';
import { Popover } from '@headlessui/react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	clearP2POrderActionError,
	setP2POrders,
} from '../../slices/p2pOrderSlice';
import {
	deleteP2POrder,
	editP2POrder,
	releaseP2POrderForBuy,
} from '../../redux/thunks/p2pOrdersThunk';

const PAGE_SIZE = 10;
const SPECIAL_EDIT_KEYS = new Set([
	'paymentMethods',
	'paymentTiming',
	'paymentDetails',
	'uploadedImages',
]);
const KNOWN_PAYMENT_METHODS = ['PayPal', 'Bank Transfer', 'Cash App', 'Wire Transfer'];

const serializeEditValue = (value) => {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') {
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return '';
		}
	}
	return String(value);
};

const parseEditValue = (value) => {
	const trimmed = String(value ?? '').trim();
	if (trimmed === '') return '';
	return value;
};

const P2POrdersPage = () => {
	const dispatch = useDispatch();
	const { orders, actionLoading } = useSelector((state) => state.p2pOrders);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [sortKey, setSortKey] = useState('createdAt');
	const [sortDirection, setSortDirection] = useState('desc');
	const [statusFilter, setStatusFilter] = useState('all');
	const [coinFilter, setCoinFilter] = useState('all');
	const [adTypeFilter, setAdTypeFilter] = useState('all');
	const [modal, setModal] = useState({ type: '', payload: null });
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
	const [orderTypeTab, setOrderTypeTab] = useState('buy');
	const [editForm, setEditForm] = useState({});
	const [editPaymentMethods, setEditPaymentMethods] = useState([]);
	const [editCustomPaymentMethod, setEditCustomPaymentMethod] = useState('');
	const [selectedEditPaymentMethod, setSelectedEditPaymentMethod] = useState('');
	const [editPaymentDetails, setEditPaymentDetails] = useState({});
	const [newPaymentDetailKey, setNewPaymentDetailKey] = useState('');
	const [newPaymentDetailValue, setNewPaymentDetailValue] = useState('');
	const [editPaymentTiming, setEditPaymentTiming] = useState({
		elapsedSeconds: '',
		paymentWindowSeconds: '',
		remainingSeconds: '',
	});
	const [editUploadedImages, setEditUploadedImages] = useState([]);

	useEffect(() => {
		setPage(1);
	}, [search, statusFilter, coinFilter, adTypeFilter, orderTypeTab]);

	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true);
			setError('');
			const res = await axiosInstance.get('admin/p2pOrders');
			const payload = res?.data?.message ?? res?.data ?? [];
			const normalized = Array.isArray(payload)
				? payload.map((item, index) => normalizeOrder(item, index))
				: [];
			dispatch(setP2POrders(normalized));
		} catch (err) {
			console.error('Failed to fetch P2P orders:', err);
			const msg = 'Failed to fetch P2P orders';
			setError(msg);
			showError(msg);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const formatTimer = (totalSeconds) => {
		if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '';
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = Math.floor(totalSeconds % 60);
		return `${minutes}:${String(seconds).padStart(2, '0')}`;
	};

	const renderPaymentWindow = (timing) => {
		if (!timing || typeof timing !== 'object') return '';
		const elapsed = Number(timing.elapsedSeconds);
		const windowSeconds = Number(timing.paymentWindowSeconds);
		const remaining =
			Number.isFinite(timing.remainingSeconds)
				? Number(timing.remainingSeconds)
				: Number.isFinite(windowSeconds) && Number.isFinite(elapsed)
					? windowSeconds - elapsed
					: NaN;
		if (!Number.isFinite(elapsed) && !Number.isFinite(remaining)) return '';
		const remainingText = Number.isFinite(remaining)
			? remaining <= 0
				? 'Expired'
				: formatTimer(remaining)
			: '';
		const elapsedText = Number.isFinite(elapsed) ? formatTimer(elapsed) : '';
		const windowText = Number.isFinite(windowSeconds) ? formatTimer(windowSeconds) : '';
		return [
			remainingText ? `Remaining ${remainingText}` : '',
			elapsedText ? `Elapsed ${elapsedText}` : '',
			windowText ? `Window ${windowText}` : '',
		]
			.filter(Boolean)
			.join(' | ');
	};

	const isPaymentExpired = (timing) => {
		if (!timing || typeof timing !== 'object') return false;
		const remaining = Number(timing.remainingSeconds);
		if (Number.isFinite(remaining)) return remaining <= 0;
		const elapsed = Number(timing.elapsedSeconds);
		const windowSeconds = Number(timing.paymentWindowSeconds);
		if (!Number.isFinite(elapsed) || !Number.isFinite(windowSeconds)) return false;
		return windowSeconds - elapsed <= 0;
	};

	const renderStatusBadge = (status) => {
		const label = status || '';
		if (!String(label).trim()) return '-';
		const key = String(status || '').trim().toLowerCase();
		let className = 'bg-slate-700/60 text-slate-100';
		if (key === 'confirmed' || key === 'completed' || key === 'success') {
			className =
				orderTypeTab === 'buy'
					? 'bg-emerald-500/15 text-emerald-200'
					: 'bg-sky-500/15 text-sky-200';
		} else if (key === 'pending') {
			className =
				orderTypeTab === 'buy'
					? 'bg-amber-500/15 text-amber-200'
					: 'bg-orange-500/15 text-orange-200';
		} else if (key === 'cancelled' || key === 'canceled' || key === 'rejected') {
			className = 'bg-rose-500/15 text-rose-200';
		} else if (key === 'disputed') {
			className = 'bg-indigo-500/15 text-indigo-200';
		} else if (key === 'expired') {
			className = 'bg-orange-500/15 text-orange-200';
		}
		return (
			<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
				{label}
			</span>
		);
	};

	const formatNumber = (value, maximumFractionDigits = 2) => {
		const num = Number(value);
		if (!Number.isFinite(num)) return value ?? '';
		return num.toLocaleString(undefined, { maximumFractionDigits });
	};

	const renderValue = (value) => {
		if (value === null || value === undefined) return '-';
		const str = String(value);
		return str.trim() === '' ? '-' : str;
	};

	const exportCsv = () => {
		const headers = [
			'Order ID',
			'User ID',
			'Ad Type',
			'Coin',
			'Fiat',
			'Fiat Amount',
			'Crypto Amount',
			'Price',
			'Payment Method',
			'Merchant',
			'Orders',
			'Completion',
			'Limit Range',
			'Quantity',
			'Status',
			'Created At',
			'Confirmed At',
			'Updated At',
			'User Release',
			'Reserved Amount',
			'Payment Methods',
			'Payment Window',
			'Images Count',
		];
		const rows = sortedOrders.map((order) => [
			order.orderId,
			order.userId,
			order.adType,
			order.coin,
			order.fiat,
			order.fiatAmount,
			order.cryptoAmount,
			order.price,
			order.paymentMethod,
			order.merchant,
			order.orders,
			order.completion,
			order.limitRange,
			order.quantity,
			order.status,
			order.createdAt,
			order.confirmedAt,
			order.updatedAt,
			order.userRelease,
			order.reservedAmount,
			Array.isArray(order.paymentMethods) ? order.paymentMethods.join(' | ') : '',
			renderPaymentWindow(order.paymentTiming),
			Array.isArray(order.uploadedImages) ? order.uploadedImages.length : 0,
		]);
		const escapeCell = (cell) => {
			const value = cell === null || cell === undefined ? '' : String(cell);
			if (/[",\n]/.test(value)) {
				return `"${value.replace(/"/g, '""')}"`;
			}
			return value;
		};
		const csvContent = [headers, ...rows]
			.map((row) => row.map(escapeCell).join(','))
			.join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `p2p-orders-${new Date().toISOString().slice(0, 10)}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const handleCopy = async (value) => {
		if (!value || typeof value !== 'string') return;
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(value);
				showSuccess('Copied to clipboard');
				return;
			}
		} catch (err) {
			console.error('Clipboard API failed, falling back', err);
		}
		try {
			const textarea = document.createElement('textarea');
			textarea.value = value;
			textarea.setAttribute('readonly', '');
			textarea.style.position = 'absolute';
			textarea.style.left = '-9999px';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			showSuccess('Copied to clipboard');
		} catch (err) {
			console.error('Fallback copy failed', err);
			showError('Failed to copy');
		}
	};

	const openPaymentDetails = (order) => {
		if (!order?.paymentDetails) return;
		const methods = Object.keys(order.paymentDetails || {});
		setSelectedPaymentMethod(methods[0] || '');
		setModal({ type: 'payment', payload: order });
	};

	const openImageModal = (url) => {
		if (!url) return;
		setModal({ type: 'image', payload: url });
	};

	const openEditOrderModal = (order) => {
		if (!order) return;
		const fullEditForm = Object.entries(order).reduce((acc, [key, value]) => {
			if (SPECIAL_EDIT_KEYS.has(key)) return acc;
			acc[key] = serializeEditValue(value);
			return acc;
		}, {});
		setEditForm(fullEditForm);
		const methods = Array.isArray(order.paymentMethods) ? order.paymentMethods : [];
		setEditPaymentMethods(methods);
		setSelectedEditPaymentMethod(methods[0] || '');
		setEditPaymentDetails(
			order.paymentDetails && typeof order.paymentDetails === 'object'
				? order.paymentDetails
				: {}
		);
		setEditPaymentTiming({
			elapsedSeconds: String(order?.paymentTiming?.elapsedSeconds ?? ''),
			paymentWindowSeconds: String(order?.paymentTiming?.paymentWindowSeconds ?? ''),
			remainingSeconds: String(order?.paymentTiming?.remainingSeconds ?? ''),
		});
		setEditUploadedImages(
			Array.isArray(order.uploadedImages)
				? order.uploadedImages.map((item) =>
						typeof item === 'string'
							? item
							: item && typeof item === 'object' && typeof item.url === 'string'
								? item.url
								: ''
				  )
				: []
		);
		setModal({ type: 'editOrder', payload: order });
	};

	const closeModal = () => {
		setModal({ type: '', payload: null });
		setEditForm({});
		setEditPaymentMethods([]);
		setEditCustomPaymentMethod('');
		setSelectedEditPaymentMethod('');
		setEditPaymentDetails({});
		setNewPaymentDetailKey('');
		setNewPaymentDetailValue('');
		setEditPaymentTiming({
			elapsedSeconds: '',
			paymentWindowSeconds: '',
			remainingSeconds: '',
		});
		setEditUploadedImages([]);
	};

	const getOrderActionId = (order) => {
		const value = order?.orderId || order?.id;
		return value === null || value === undefined ? '' : String(value).trim();
	};

	const handleEditOrderSubmit = async () => {
		if (modal.type !== 'editOrder' || !modal.payload) return;
		const orderId = getOrderActionId(modal.payload);
		if (!orderId) {
			showError('Order identifier is missing');
			return;
		}

		dispatch(clearP2POrderActionError());
		try {
			const payload = Object.entries(editForm).reduce((acc, [key, value]) => {
				acc[key] = parseEditValue(value);
				return acc;
			}, {});
			delete payload.id;
			payload.paymentMethods = editPaymentMethods;
			payload.paymentDetails = editPaymentDetails;
			payload.paymentTiming = {
				elapsedSeconds: editPaymentTiming.elapsedSeconds,
				paymentWindowSeconds: editPaymentTiming.paymentWindowSeconds,
				remainingSeconds: editPaymentTiming.remainingSeconds,
			};
			payload.uploadedImages = editUploadedImages.filter((url) =>
				String(url).trim()
			);

			await dispatch(
				editP2POrder({
					orderId,
					payload,
				})
			).unwrap();
			showSuccess('P2P order updated');
			closeModal();
		} catch (err) {
			showError(typeof err === 'string' ? err : 'Failed to edit P2P order');
			closeModal();
		}
	};

	const handleReleaseOrder = async (order) => {
		if (isOrderAlreadyReleased(order)) {
			showError('This order has already been released');
			return;
		}

		const orderId = getOrderActionId(order);
		if (!orderId) {
			showError('Order identifier is missing');
			return;
		}
		dispatch(clearP2POrderActionError());
		try {
			await dispatch(releaseP2POrderForBuy(orderId)).unwrap();
			showSuccess('Order released for buy');
		} catch (err) {
			showError(typeof err === 'string' ? err : 'Failed to release order');
		}
	};

	const handleDeleteOrder = async (order) => {
		const orderId = getOrderActionId(order);
		if (!orderId) {
			showError('Order identifier is missing');
			return;
		}
		if (!window.confirm(`Delete P2P order ${orderId}?`)) return;
		dispatch(clearP2POrderActionError());
		try {
			await dispatch(deleteP2POrder(orderId)).unwrap();
			showSuccess('P2P order deleted');
		} catch (err) {
			showError(typeof err === 'string' ? err : 'Failed to delete order');
		}
	};

	const addPaymentMethod = (method) => {
		const value = String(method || '').trim();
		if (!value) return;
		setEditPaymentMethods((prev) =>
			prev.includes(value) ? prev : [...prev, value]
		);
		setSelectedEditPaymentMethod(value);
		setEditPaymentDetails((prev) => ({
			...prev,
			[value]: prev[value] && typeof prev[value] === 'object' ? prev[value] : {},
		}));
	};

	const removePaymentMethod = (method) => {
		setEditPaymentMethods((prev) => prev.filter((m) => m !== method));
		setEditPaymentDetails((prev) => {
			const next = { ...prev };
			delete next[method];
			return next;
		});
		setSelectedEditPaymentMethod((prev) => (prev === method ? '' : prev));
	};

	const selectedMethodDetails =
		selectedEditPaymentMethod && editPaymentDetails[selectedEditPaymentMethod]
			? editPaymentDetails[selectedEditPaymentMethod]
			: {};

	const isOrderAlreadyReleased = (order) => {
		const statusKey = String(order?.status || '').trim().toLowerCase();
		const releasedAtRaw = String(order?.releasedAt ?? '')
			.trim()
			.toLowerCase();
		const hasReleasedAt =
			releasedAtRaw !== '' &&
			releasedAtRaw !== 'false' &&
			releasedAtRaw !== '0' &&
			releasedAtRaw !== 'null' &&
			releasedAtRaw !== 'undefined';
		return hasReleasedAt && statusKey === 'confirmed';
	};

	const paymentMethodOptions =
		modal.type === 'payment' && modal.payload?.paymentDetails
			? Object.keys(modal.payload.paymentDetails)
			: [];

	const selectedPaymentDetails =
		modal.type === 'payment' && modal.payload?.paymentDetails && selectedPaymentMethod
			? modal.payload.paymentDetails[selectedPaymentMethod]
			: null;

	const buildImageUrl = (value) => {
		if (!value) return '';
		if (typeof value === 'string') return value;
		if (typeof value === 'object' && typeof value.url === 'string') return value.url;
		return '';
	};

	const columns = useMemo(
		() => [
			'No.',
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
			'Confirmed At',
			'Updated At',
			'User Release',
			'Reserved',
			'Payment Window',
			'Payment Methods',
			'Payment Details',
			'Images',
			'Action',
		],
		[]
	);

	const getSortValue = (order, key) => {
		if (!order) return '';
		if (key === 'createdAt' || key === 'confirmedAt' || key === 'updatedAt') {
			const value = order[key];
			const date = value ? new Date(value) : null;
			return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
		}
		if (key === 'fiatAmount' || key === 'cryptoAmount' || key === 'price' || key === 'reservedAmount') {
			const num = Number(order[key]);
			return Number.isFinite(num) ? num : 0;
		}
		return String(order[key] ?? '').toLowerCase();
	};

	const toggleSort = (key) => {
		if (sortKey === key) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortDirection('asc');
		}
	};

	const filteredOrders = useMemo(() => {
		const q = search.trim().toLowerCase();
		const byTab = orders.filter(
			(order) => String(order.adType || '').trim().toLowerCase() === orderTypeTab
		);
		const byStatus =
			statusFilter === 'all'
				? byTab
				: byTab.filter(
						(order) =>
							String(order.status || '').trim().toLowerCase() === statusFilter
				  );
		const byCoin =
			coinFilter === 'all'
				? byStatus
				: byStatus.filter(
						(order) => String(order.coin || '').trim().toLowerCase() === coinFilter
				  );
		const byAdType =
			adTypeFilter === 'all'
				? byCoin
				: byCoin.filter(
						(order) => String(order.adType || '').trim().toLowerCase() === adTypeFilter
				  );
		if (!q) return byAdType;
		return byAdType.filter((order) =>
			[
				order.orderId,
				order.userId,
				order.merchant,
				order.coin,
				order.fiat,
				order.paymentMethod,
				Array.isArray(order.paymentMethods) ? order.paymentMethods.join(' ') : '',
				order.status,
				order.createdAt,
				order.confirmedAt,
				order.updatedAt,
				order.userRelease,
				order.reservedAmount,
			]
				.join(' ')
				.toLowerCase()
				.includes(q)
		);
	}, [orders, search, statusFilter, coinFilter, adTypeFilter, orderTypeTab]);

	const sortedOrders = useMemo(() => {
		const copy = [...filteredOrders];
		copy.sort((a, b) => {
			const aVal = getSortValue(a, sortKey);
			const bVal = getSortValue(b, sortKey);
			if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
		return copy;
	}, [filteredOrders, sortDirection, sortKey]);

	const statusOptions = useMemo(() => {
		const base = new Set();
		orders.forEach((order) => {
			const value = String(order.status || '').trim().toLowerCase();
			if (value) base.add(value);
		});
		return ['all', ...Array.from(base).sort()];
	}, [orders]);

	const tabOrders = useMemo(
		() =>
			orders.filter(
				(order) => String(order.adType || '').trim().toLowerCase() === orderTypeTab
			),
		[orders, orderTypeTab]
	);

	const coinOptions = useMemo(() => {
		const base = new Set();
		orders.forEach((order) => {
			const value = String(order.coin || '').trim().toLowerCase();
			if (value) base.add(value);
		});
		return ['all', ...Array.from(base).sort()];
	}, [orders]);

	const adTypeOptions = useMemo(() => {
		const base = new Set();
		orders.forEach((order) => {
			const value = String(order.adType || '').trim().toLowerCase();
			if (value) base.add(value);
		});
		return ['all', ...Array.from(base).sort()];
	}, [orders]);

	const statusSummary = useMemo(() => {
		const summary = {};
		tabOrders.forEach((order) => {
			const key = String(order.status || '').trim().toLowerCase() || 'unknown';
			summary[key] = (summary[key] || 0) + 1;
		});
		return summary;
	}, [tabOrders]);

	const totalPages = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const pageItems = sortedOrders.slice(
		(safePage - 1) * PAGE_SIZE,
		safePage * PAGE_SIZE
	);

	const sortOptions = [
		{ key: 'createdAt', label: 'Created At' },
		{ key: 'confirmedAt', label: 'Confirmed At' },
		{ key: 'updatedAt', label: 'Updated At' },
		{ key: 'fiatAmount', label: 'Fiat Amount' },
		{ key: 'cryptoAmount', label: 'Crypto Amount' },
		{ key: 'price', label: 'Price' },
		{ key: 'reservedAmount', label: 'Reserved' },
		{ key: 'status', label: 'Status' },
		{ key: 'merchant', label: 'Merchant' },
	];

	return (
		<div className='space-y-5'>
			<div className='panel panel-pad'>
				<div className='flex flex-col gap-4'>
					<div className='flex items-center gap-2'>
						<button
							type='button'
							className={`rounded-full px-3 py-1 text-xs font-semibold ${
								orderTypeTab === 'buy'
									? 'bg-emerald-500/20 text-emerald-200'
									: 'bg-slate-800 text-slate-300'
							}`}
							onClick={() => setOrderTypeTab('buy')}
						>
							Buy
						</button>
						<button
							type='button'
							className={`rounded-full px-3 py-1 text-xs font-semibold ${
								orderTypeTab === 'sell'
									? 'bg-rose-500/20 text-rose-200'
									: 'bg-slate-800 text-slate-300'
							}`}
							onClick={() => setOrderTypeTab('sell')}
						>
							Sell
						</button>
					</div>
					<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
						<div>
							<h2 className='text-xl font-semibold text-white'>P2P Orders</h2>
							{Object.keys(statusSummary).length > 0 && (
								<div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-200'>
									{Object.entries(statusSummary).map(([key, count]) => (
										<span
											key={key}
											className='rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-200'
										>
											{orderTypeTab === 'buy' ? 'Buy' : 'Sell'}{' '}
											{key.charAt(0).toUpperCase() + key.slice(1)}: {count}
										</span>
									))}
								</div>
							)}
						</div>
						<div className='flex items-center gap-2'>
							<button className='button-ghost text-xs' onClick={exportCsv}>
								Export CSV
							</button>
						</div>
					</div>
					<div className='flex flex-wrap items-center justify-end gap-2'>
						<div className='flex items-center gap-2'>
							<label className='text-xs text-slate-200'>Status</label>
							<select
								className='input-dark text-xs'
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
							>
								{statusOptions.map((status) => (
									<option key={status} value={status}>
										{status === 'all'
											? 'All'
											: status.charAt(0).toUpperCase() + status.slice(1)}
									</option>
								))}
							</select>
						</div>
						<div className='flex items-center gap-2'>
							<label className='text-xs text-slate-200'>Coin</label>
							<select
								className='input-dark text-xs'
								value={coinFilter}
								onChange={(e) => setCoinFilter(e.target.value)}
							>
								{coinOptions.map((coin) => (
									<option key={coin} value={coin}>
										{coin === 'all' ? 'All' : coin.toUpperCase()}
									</option>
								))}
							</select>
						</div>
						<div className='flex items-center gap-2'>
							<label className='text-xs text-slate-200'>Ad Type</label>
							<select
								className='input-dark text-xs'
								value={adTypeFilter}
								onChange={(e) => setAdTypeFilter(e.target.value)}
							>
								{adTypeOptions.map((adType) => (
									<option key={adType} value={adType}>
										{adType === 'all'
											? 'All'
											: adType.charAt(0).toUpperCase() + adType.slice(1)}
									</option>
								))}
							</select>
						</div>
						<div className='flex items-center gap-2'>
							<label className='text-xs text-slate-200'>Sort by</label>
							<select
								className='input-dark text-xs'
								value={sortKey}
								onChange={(e) => toggleSort(e.target.value)}
							>
								{sortOptions.map((option) => (
									<option key={option.key} value={option.key}>
										{option.label}
									</option>
								))}
							</select>
							<button
								className='button-ghost text-xs'
								onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
							>
								{sortDirection === 'asc' ? 'Asc' : 'Desc'}
							</button>
						</div>
					</div>
					<div className='flex'>
						<input
							type='text'
							placeholder='Search orders...'
							className='input-dark w-full md:max-w-lg'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
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
						<div className='mt-6 table-wrap scrollbar-hide max-h-[70vh] overflow-y-auto'>
							<table className='table-base'>
								<thead className='table-head sticky top-0 z-20 bg-slate-900/80 backdrop-blur'>
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
										pageItems.map((order, index) => (
											<React.Fragment key={order.id ?? order.orderId}>
												<tr
													className={`table-row h-16 ${
														isPaymentExpired(order.paymentTiming)
															? 'bg-rose-500/10'
															: ''
													}`}
												>
													<td className='px-3 py-2 whitespace-nowrap'>
														{(safePage - 1) * PAGE_SIZE + index + 1}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														<div className='flex items-center gap-2'>
															<span>
																{order.orderId ? `#${order.orderId}` : '-'}
															</span>
															<button
																type='button'
																className='button-ghost text-[10px]'
																onClick={() => handleCopy(getOrderActionId(order))}
															>
																Copy
															</button>
														</div>
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.userId)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.adType)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderValue(order.coin)}/{renderValue(order.fiat)}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderValue(formatNumber(order.fiatAmount, 2))}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderValue(formatNumber(order.cryptoAmount, 8))}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderValue(formatNumber(order.price, 2))}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderValue(order.paymentMethod)}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.merchant)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.orders)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.completion)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.limitRange)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.quantity)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderStatusBadge(order.status)}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.createdAt)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.confirmedAt)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.updatedAt)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>{renderValue(order.userRelease)}</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderValue(formatNumber(order.reservedAmount, 8))}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{renderValue(renderPaymentWindow(order.paymentTiming))}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{Array.isArray(order.paymentMethods)
															? renderValue(order.paymentMethods.join(', '))
															: '-'}
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														<button
															type='button'
															className='button-ghost text-xs'
															onClick={() => openPaymentDetails(order)}
															disabled={!order.paymentDetails}
														>
															{order.paymentDetails ? 'View' : '-'}
														</button>
													</td>
													<td className='px-3 py-2 whitespace-nowrap'>
														{Array.isArray(order.uploadedImages) &&
														order.uploadedImages.length > 0 ? (
															<div className='flex items-center gap-2'>
																<button
																	type='button'
																	className='h-10 w-14 overflow-hidden rounded border border-slate-700'
																	onClick={() =>
																		openImageModal(buildImageUrl(order.uploadedImages[0]))
																	}
																>
																	<img
																		src={buildImageUrl(order.uploadedImages[0])}
																		alt={`Order ${order.orderId} upload`}
																		className='h-full w-full object-cover'
																	/>
																</button>
																{order.uploadedImages[1] && (
																	<button
																		type='button'
																		className='h-10 w-14 overflow-hidden rounded border border-slate-700'
																		onClick={() =>
																			openImageModal(buildImageUrl(order.uploadedImages[1]))
																		}
																	>
																		<img
																			src={buildImageUrl(order.uploadedImages[1])}
																			alt={`Order ${order.orderId} upload 2`}
																			className='h-full w-full object-cover'
																		/>
																	</button>
																)}
															</div>
														) : (
															<span className='text-xs text-slate-400'>-</span>
														)}
													</td>
													<td className='px-3 py-2 whitespace-nowrap relative z-10'>
														<Popover className='relative z-10'>
															{({ open }) => (
																<div>
																	<Popover.Button className='icon-button'>
																		<i className='bi bi-three-dots-vertical' />
																	</Popover.Button>
																	{open && typeof document !== 'undefined'
																		? createPortal(
																				<Popover.Panel className='fixed top-[50%] left-[43%] lg:left-[83%] transform -translate-x-1/2 -translate-y-1/2 z-[10000] menu-panel'>
																				{({ close }) => (
																					<>
																						<p className='muted-text text-xs mb-2'>
																							Open Modals
																						</p>
																							<button
																								className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded'
																								onClick={() => {
																									openPaymentDetails(order);
																									close();
																								}}
																								disabled={!order.paymentDetails}
																							>
																								Payment Details
																							</button>
																							<button
																								className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded'
																								onClick={() => {
																									openEditOrderModal(order);
																									close();
																								}}
																							>
																								Edit P2P Order
																							</button>
																						<div className='my-2 h-px w-full bg-slate-800' />
																						<p className='muted-text text-xs mb-2'>
																							Direct Actions
																						</p>
																						<button
																							className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded'
																							onClick={() => {
																								handleCopy(getOrderActionId(order));
																								close();
																							}}
																						>
																							Copy Order ID
																						</button>
																						<button
																							className='w-full text-left px-2 py-1 hover:bg-[#151c26] rounded disabled:opacity-50 disabled:cursor-not-allowed'
																							onClick={() => {
																								handleReleaseOrder(order);
																								close();
																							}}
																							disabled={actionLoading || isOrderAlreadyReleased(order)}
																						>
																							{isOrderAlreadyReleased(order)
																								? 'Already Released'
																								: 'Release For Buy'}
																						</button>
																						<button
																							className='w-full text-left px-2 py-1 hover:bg-rose-900/40 text-rose-200 rounded'
																							onClick={() => {
																								handleDeleteOrder(order);
																								close();
																							}}
																							disabled={actionLoading}
																						>
																							Delete P2P Order
																						</button>
																					</>
																				)}
																				</Popover.Panel>,
																				document.body
																		  )
																		: null}
																</div>
															)}
														</Popover>
													</td>
												</tr>
											</React.Fragment>
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
			{modal.type && (
				<div
					className='fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4'
					onClick={closeModal}
				>
					<div
						className='max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-xl'
						onClick={(e) => e.stopPropagation()}
					>
						<div className='flex items-center justify-between'>
							<h3 className='text-lg font-semibold'>
								{modal.type === 'payment'
									? 'Payment Details'
									: modal.type === 'editOrder'
										? 'Edit P2P Order'
										: 'Image Preview'}
							</h3>
							<button className='button-ghost text-xs' onClick={closeModal}>
								Close
							</button>
						</div>
						{modal.type === 'payment' && (
							<div className='mt-4 space-y-4'>
								<div className='flex items-center gap-3'>
									<label className='text-xs text-slate-300'>Method</label>
									<select
										className='input-dark text-xs'
										value={selectedPaymentMethod}
										onChange={(e) => setSelectedPaymentMethod(e.target.value)}
									>
										{paymentMethodOptions.map((method) => (
											<option key={method} value={method}>
												{method}
											</option>
										))}
									</select>
								</div>
								{selectedPaymentDetails ? (
									<div className='grid gap-3 sm:grid-cols-2'>
										{Object.entries(selectedPaymentDetails).map(([key, value]) => (
											<div key={key} className='space-y-1'>
												<label className='text-xs text-slate-400'>{key}</label>
												<input
													type='text'
													readOnly
													className='input-dark w-full text-xs'
													value={value ?? ''}
												/>
											</div>
										))}
									</div>
								) : (
									<p className='text-xs text-slate-400'>No payment details found.</p>
								)}
							</div>
						)}
						{modal.type === 'editOrder' && (
							<div className='mt-4 space-y-4'>
								<div className='grid gap-3 sm:grid-cols-2'>
									{Object.entries(editForm).map(([key, value]) => {
										const isLong =
											String(value).includes('\n') ||
											String(value).startsWith('{') ||
											String(value).startsWith('[') ||
											String(value).length > 80;
										const isReadonly = key === 'id';
										return (
											<div
												key={key}
												className={`space-y-1 ${isLong ? 'sm:col-span-2' : ''}`}
											>
												<label className='text-xs text-slate-400'>{key}</label>
												{isLong ? (
													<textarea
														className='input-dark w-full text-xs min-h-24'
														value={value}
														readOnly={isReadonly}
														onChange={(e) =>
															setEditForm((prev) => ({
																...prev,
																[key]: e.target.value,
															}))
														}
													/>
												) : (
													<input
														type='text'
														className='input-dark w-full text-xs'
														value={value}
														readOnly={isReadonly}
														onChange={(e) =>
															setEditForm((prev) => ({
																...prev,
																[key]: e.target.value,
															}))
														}
													/>
												)}
											</div>
										);
									})}
								</div>
								<div className='space-y-3 rounded-lg border border-slate-800 p-3'>
									<label className='text-xs text-slate-300'>paymentMethods</label>
									<div className='flex flex-wrap items-center gap-2'>
										<select
											className='input-dark text-xs w-56'
											value=''
											onChange={(e) => addPaymentMethod(e.target.value)}
										>
											<option value=''>Select payment method</option>
											{KNOWN_PAYMENT_METHODS.map((method) => (
												<option key={method} value={method}>
													{method}
												</option>
											))}
										</select>
										<input
											type='text'
											className='input-dark text-xs w-56'
											placeholder='Custom method'
											value={editCustomPaymentMethod}
											onChange={(e) => setEditCustomPaymentMethod(e.target.value)}
										/>
										<button
											type='button'
											className='button-ghost text-xs'
											onClick={() => {
												addPaymentMethod(editCustomPaymentMethod);
												setEditCustomPaymentMethod('');
											}}
										>
											Add
										</button>
									</div>
									<div className='flex flex-wrap gap-2'>
										{editPaymentMethods.map((method) => (
											<span
												key={method}
												className='inline-flex items-center gap-2 rounded-full border border-slate-700 px-2 py-1 text-xs'
											>
												{method}
												<button
													type='button'
													className='text-rose-300'
													onClick={() => removePaymentMethod(method)}
												>
													x
												</button>
											</span>
										))}
									</div>
								</div>

								<div className='space-y-3 rounded-lg border border-slate-800 p-3'>
									<label className='text-xs text-slate-300'>paymentDetails</label>
									<div className='flex items-center gap-2'>
										<select
											className='input-dark text-xs w-64'
											value={selectedEditPaymentMethod}
											onChange={(e) => setSelectedEditPaymentMethod(e.target.value)}
										>
											<option value=''>Select method</option>
											{editPaymentMethods.map((method) => (
												<option key={method} value={method}>
													{method}
												</option>
											))}
										</select>
									</div>
									{selectedEditPaymentMethod && (
										<div className='space-y-2'>
											{Object.entries(selectedMethodDetails).map(([k, v]) => (
												<div key={k} className='grid gap-2 sm:grid-cols-2'>
													<input
														type='text'
														className='input-dark text-xs'
														value={k}
														readOnly
													/>
													<input
														type='text'
														className='input-dark text-xs'
														value={v ?? ''}
														onChange={(e) =>
															setEditPaymentDetails((prev) => ({
																...prev,
																[selectedEditPaymentMethod]: {
																	...(prev[selectedEditPaymentMethod] || {}),
																	[k]: e.target.value,
																},
															}))
														}
													/>
												</div>
											))}
											<div className='grid gap-2 sm:grid-cols-[1fr_1fr_auto]'>
												<input
													type='text'
													className='input-dark text-xs'
													placeholder='New detail key'
													value={newPaymentDetailKey}
													onChange={(e) => setNewPaymentDetailKey(e.target.value)}
												/>
												<input
													type='text'
													className='input-dark text-xs'
													placeholder='New detail value'
													value={newPaymentDetailValue}
													onChange={(e) => setNewPaymentDetailValue(e.target.value)}
												/>
												<button
													type='button'
													className='button-ghost text-xs'
													onClick={() => {
														const key = newPaymentDetailKey.trim();
														if (!key || !selectedEditPaymentMethod) return;
														setEditPaymentDetails((prev) => ({
															...prev,
															[selectedEditPaymentMethod]: {
																...(prev[selectedEditPaymentMethod] || {}),
																[key]: newPaymentDetailValue,
															},
														}));
														setNewPaymentDetailKey('');
														setNewPaymentDetailValue('');
													}}
												>
													Add Detail
												</button>
											</div>
										</div>
									)}
								</div>

								<div className='space-y-3 rounded-lg border border-slate-800 p-3'>
									<label className='text-xs text-slate-300'>paymentTiming</label>
									<div className='grid gap-2 sm:grid-cols-3'>
										<input
											type='text'
											className='input-dark text-xs'
											placeholder='elapsedSeconds'
											value={editPaymentTiming.elapsedSeconds}
											onChange={(e) =>
												setEditPaymentTiming((prev) => ({
													...prev,
													elapsedSeconds: e.target.value,
												}))
											}
										/>
										<input
											type='text'
											className='input-dark text-xs'
											placeholder='paymentWindowSeconds'
											value={editPaymentTiming.paymentWindowSeconds}
											onChange={(e) =>
												setEditPaymentTiming((prev) => ({
													...prev,
													paymentWindowSeconds: e.target.value,
												}))
											}
										/>
										<input
											type='text'
											className='input-dark text-xs'
											placeholder='remainingSeconds'
											value={editPaymentTiming.remainingSeconds}
											onChange={(e) =>
												setEditPaymentTiming((prev) => ({
													...prev,
													remainingSeconds: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								<div className='space-y-3 rounded-lg border border-slate-800 p-3'>
									<label className='text-xs text-slate-300'>uploadedImages</label>
									{editUploadedImages.map((url, idx) => (
										<div key={idx} className='grid gap-2 sm:grid-cols-[1fr_auto]'>
											<input
												type='text'
												className='input-dark text-xs'
												value={url}
												onChange={(e) =>
													setEditUploadedImages((prev) =>
														prev.map((item, i) =>
															i === idx ? e.target.value : item
														)
													)
												}
											/>
											<button
												type='button'
												className='button-ghost text-xs'
												onClick={() =>
													setEditUploadedImages((prev) =>
														prev.filter((_, i) => i !== idx)
													)
												}
											>
												Remove
											</button>
										</div>
									))}
									<button
										type='button'
										className='button-ghost text-xs'
										onClick={() =>
											setEditUploadedImages((prev) => [...prev, ''])
										}
									>
										Add Image URL
									</button>
								</div>
								<div className='flex justify-end'>
									<button
										type='button'
										className='button-primary text-xs'
										onClick={handleEditOrderSubmit}
										disabled={actionLoading}
									>
										{actionLoading ? 'Saving...' : 'Save Changes'}
									</button>
								</div>
							</div>
						)}
						{modal.type === 'image' && (
							<div className='mt-4'>
								<img
									src={modal.payload}
									alt='Uploaded evidence'
									className='max-h-[65vh] w-full rounded-lg object-contain'
								/>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default P2POrdersPage;
