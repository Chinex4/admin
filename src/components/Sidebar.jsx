import { useState } from 'react';
import {
	ChevronDown,
	Menu,
	Users,
	Monitor,
	Wallet,
	Bell,
	PieChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, children, isCollapsed }) => {
	const [open, setOpen] = useState(false);

	return (
		<div>
			<button
				onClick={() => setOpen(!open)}
				className={clsx(
					'flex items-center justify-between w-full px-4 py-3 text-white hover:bg-[#1f1f1f]',
					isCollapsed && 'justify-center px-2'
				)}>
				<div className='flex items-center gap-3'>
					<Icon size={18} />
					{!isCollapsed && <span>{label}</span>}
				</div>
				{!isCollapsed && (
					<ChevronDown
						size={18}
						className={`${open ? 'rotate-180' : ''} transition-transform`}
					/>
				)}
			</button>

			{!isCollapsed && open && (
				<div className='pl-10 py-2 space-y-2 text-sm text-gray-300'>
					{children}
				</div>
			)}
		</div>
	);
};

import { X } from 'lucide-react'; // already using Menu, import X too

const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
	return (
		<aside
			className={`h-screen bg-[#111111] border-r border-gray-800 transition-all duration-300 ${
				isCollapsed ? 'w-16' : 'w-64'
			} hidden md:block`}>
			{/* Mobile close button */}
			<div className='flex justify-between items-center px-4 py-3 md:hidden border-b border-gray-800'>
				<span className='text-lime-400 text-xl font-bold'>Admin Panel</span>
				<button
					onClick={() => setIsMobileOpen(false)}
					className='text-white'>
					<X size={20} />
				</button>
			</div>

			{/* Desktop title */}
			<div
				className={clsx(
					'p-4 font-bold text-xl text-lime-400 border-b border-gray-800 hidden md:block',
					isCollapsed && 'text-center'
				)}>
				{!isCollapsed ? 'Admin Panel' : 'A'}
			</div>

			<nav className='mt-4 space-y-1'>
				<SidebarItem
					icon={Users}
					label='Users Table'
					isCollapsed={isCollapsed}>
					<Link
						to='/dashboard/users'
						className='block hover:text-lime-400'>
						Everything About the User
					</Link>
					<Link
						to='/dashboard/users/kyc'
						className='block hover:text-lime-400'>
						KYC Info
					</Link>
				</SidebarItem>

				<SidebarItem
					icon={Monitor}
					label='Transaction Table'
					isCollapsed={isCollapsed}>
					<Link
						to='/dashboard/transactions'
						className='block hover:text-lime-400'>
						All Transactions
					</Link>
				</SidebarItem>

				<SidebarItem
					icon={PieChart}
					label='Trade Table'
					isCollapsed={isCollapsed}>
					<Link
						to='/dashboard/trades'
						className='block hover:text-lime-400'>
						Trade History
					</Link>
				</SidebarItem>

				<SidebarItem
					icon={Wallet}
					label='Wallet Table'
					isCollapsed={isCollapsed}>
					<Link
						to='/dashboard/wallets'
						className='block hover:text-lime-400'>
						Wallet Balances
					</Link>
				</SidebarItem>

				<SidebarItem
					icon={Bell}
					label='Notifications'
					isCollapsed={isCollapsed}>
					<Link
						to='/dashboard/notifications'
						className='block hover:text-lime-400'>
						System Alerts
					</Link>
				</SidebarItem>
			</nav>
		</aside>
	);
};

export default Sidebar;
