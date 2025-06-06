import { Popover, Transition } from '@headlessui/react';
import { ChevronLeft, ChevronRight, EllipsisVertical } from 'lucide-react';
import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setUsers,
	setSelectedUser,
	setModalType,
} from '../../slices/userSlice';
import { fetchUsers } from '../../slices/fetchSlice';
import ModalsManager from '../modals/ModalsManager';
import {
	deleteUser,
	disableUserLogin,
	enableUserLogin,
	disableAlertMessage,
	enableAlertMessage,
	disableKyc,
	enableKyc,
	resendVerificationEmail,
	disableOtpLogin,
} from '../../redux/thunks/usersThunk';
import {toast} from 'react-hot-toast'

const userFields = [
	'#',
	'Name',
	// 'Username',
	'Email',
	'Password',
	'Referral',
	'Created At',
	'Language',
	'Basic Verification',
	'Advanced Verification',
	'Institutional Verification',
	'Identity Number',
	'Anti-Phishing Code',
	'Withdrawal Security',
	'UID',
	'Currency',
	'Verify User',
	'User Login',
	'Allow Login',
	'Email Verification',
	'Total Asset',
	'Spot Account',
	'Future Account',
	'Earn Account',
	'Copy Account',
	'IP Address',
	'Referral Bonus',
	'Message',
	'Allow Message',
	'Image',
	'Access Token',
	'Lock Copy',
	'Lock Key',
	'Alert',
	'Send KYC',
	'Signal Message',
	'KYC',
	'Encrypted Password',
	'Token Expiry',
	'Refresh Token',
	'User Agent',
	'Device Type',
	'Last Login',
	'Token Revoked',
	'Actions',
];

const USERS_PER_PAGE = 15;

const UsersTable = () => {
	const dispatch = useDispatch();
	const { users } = useSelector((state) => state.users);
	const { fetchedUsers } = useSelector((state) => state.data);
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		dispatch(setUsers(fetchedUsers));
	}, [dispatch, fetchedUsers]);

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	useEffect(() => {
		setCurrentPage(1);
	}, [search]);

	const filtered = users.filter((user) =>
		Object.values(user).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
	const paginatedUsers = filtered.slice(
		(currentPage - 1) * USERS_PER_PAGE,
		currentPage * USERS_PER_PAGE
	);
  // console.log(paginatedUsers)

	const topLevelKeys = Object.keys(users[0] || {}).filter(
		(k) => k !== 'crypto'
	);
	const cryptoKeys = Object.keys(users[0]?.crypto || {});

	const handleModal = (user, type) => {
		dispatch(setSelectedUser(user));
		dispatch(setModalType(type));
	};

	const modalActions = [
		{ label: 'Edit User', type: 'edit' },
		{ label: 'Change Signal Message', type: 'signal' },
		{ label: 'Fund User', type: 'fund' },
		{ label: 'Add Profit', type: 'profit' },
		{ label: 'Add Loss', type: 'loss' },
	];

	const directActions = [
		{ label: 'Delete User', action: deleteUser },
		{ label: 'Disable User Login', action: disableUserLogin },
		{ label: 'Enable User Login', action: enableUserLogin },
		{ label: 'Disable Alert Message', action: disableAlertMessage },
		{ label: 'Enable Alert Message', action: enableAlertMessage },
		{ label: 'Disable Kyc', action: disableKyc },
		{ label: 'Enable Kyc', action: enableKyc },
		{ label: 'Resend Verification Email', action: resendVerificationEmail },
		{ label: 'Disable OTP Login', action: disableOtpLogin },
	];

  const handleDirectActionClick = async (label, user, action) => {
    try {
      const res = await dispatch(
        action(user.id)
      ).unwrap();
      toast.success(`${label} successful`);
    } catch (err) {
      toast.error(err || `${label} failed`);
    }
  }

	return (
		<div className='mt-6 bg-[#1f1f1f] rounded-xl p-6'>
			<h2 className='text-xl font-semibold text-white mb-4'>
				Every Action for Each User
			</h2>

			<input
				type='text'
				placeholder='search for a user'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='w-full mb-4 px-4 py-2 rounded-md bg-[#111] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400'
			/>

			<div className='overflow-x-auto rounded-xl scrollbar-hide'>
				<table className='table-auto text-sm text-left text-white w-full'>
					<thead className='bg-[#121212] text-gray-300'>
						<tr>
							{userFields.map((key, idx) => (
								<th
									key={idx}
									className='px-3 py-2 whitespace-nowrap capitalize'>
									{key === 'signalMsg'
										? 'Signal'
										: key === 'lockKey'
										? 'Lock Key'
										: key}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{paginatedUsers.map((user, idx) => (
							<tr
								key={idx}
								className='border-b border-gray-800 hover:bg-[#2a2a2a]'>
								{topLevelKeys.map((key, i) => (
									<td
										key={i}
										className='px-3 py-2 whitespace-nowrap'>
										{user[key] || '-'}
									</td>
								))}
								{cryptoKeys.map((coin, i) => (
									<td
										key={i}
										className='px-3 py-2 whitespace-nowrap'>
										{user.crypto[coin] || '0.00'}
									</td>
								))}
								<td className='px-3 py-2 relative z-10'>
									<Popover className='relative z-10'>
										<Popover.Button className='text-white hover:text-gray-300'>
											<EllipsisVertical className='w-5 h-5' />
										</Popover.Button>

										<Transition
											as={Fragment}
											enter='transition ease-out duration-200'
											enterFrom='opacity-0 scale-95'
											enterTo='opacity-100 scale-100'
											leave='transition ease-in duration-150'
											leaveFrom='opacity-100 scale-100'
											leaveTo='opacity-0 scale-95'>
											<Popover.Panel
												static
												className='fixed top-[50%] left-[43%] lg:left-[83%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#111] text-white shadow-lg border border-gray-700 rounded-md p-2 w-64 space-y-1'>
												<p className='text-gray-400 text-xs mb-1'>
													Open Modals
												</p>
												{modalActions.map(({ label, type }) => (
													<button
														key={type}
														onClick={() => handleModal(user, type)}
														className='w-full text-left px-2 py-1 hover:bg-[#222] rounded'>
														{label}
													</button>
												))}
												<hr className='border-gray-700 my-2' />
												<p className='text-gray-400 text-xs mb-1'>
													Direct Actions
												</p>
												{directActions.map(({ label, action }, i) => (
													<button
														key={i}
														onClick={() => handleDirectActionClick(label, user, action)}
														className='w-full text-left px-2 py-1 hover:bg-[#222] rounded'>
														{label}
													</button>
												))}
											</Popover.Panel>
										</Transition>
									</Popover>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<div className='flex justify-center gap-3 items-center mt-4 text-white'>
				<button
					disabled={currentPage === 1}
					onClick={() => setCurrentPage((prev) => prev - 1)}
					className='px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_12px_#a3e635] transition-all duration-300 hover:scale-105'>
					<ChevronLeft />
				</button>

				<span className='text-sm'>
					Page {currentPage} of {totalPages || 1}
				</span>

				<button
					disabled={currentPage === totalPages}
					onClick={() => setCurrentPage((prev) => prev + 1)}
					className='px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_12px_#a3e635] transition-all duration-300 hover:scale-105'>
					<ChevronRight />
				</button>
			</div>

			<ModalsManager />
		</div>
	);
};

export default UsersTable;
