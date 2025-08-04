import { useEffect, useState } from 'react';
import {
	ChevronDown,
	Users,
	Monitor,
	Wallet,
	Bell,
	PieChart,
	X,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const items = [
	{
		icon: Users,
		label: 'Users Table',
		routes: ['/dashboard/users'],
		children: [
			{ to: '/dashboard/users', text: 'Everything About the User' },
		],
	},
	{
		icon: Monitor,
		label: 'Transaction Table',
		routes: [
			'/dashboard/viewDeposits',
			'/dashboard/viewWithdrawal',
			'/dashboard/viewProfits',
			'/dashboard/viewLosses',
		],
		children: [
			{ to: '/dashboard/viewDeposits', text: 'About Deposit' },
			{ to: '/dashboard/viewWithdrawal', text: 'About Crypto Withdrawal' },
			{ to: '/dashboard/viewProfits', text: 'About Profit' },
			{ to: '/dashboard/viewLosses', text: 'About Loss' },
		],
	},
	{
		icon: PieChart,
		label: 'Trade Table',
		routes: ['/dashboard/viewTrades'],
		children: [{ to: '/dashboard/viewTrades', text: 'About Trade' }],
	},
	{
		icon: Wallet,
		label: 'Wallet Table',
		routes: ['/dashboard/viewBrokersWallet'],
		children: [
			{ to: '/dashboard/viewBrokersWallet', text: "About Broker's Wallet" },
		],
	},
	{
		icon: Bell,
		label: 'Identity Verification (KYC)',
		routes: ['/dashboard/viewProofs', '/dashboard/viewKyc'],
		children: [
			{ to: '/dashboard/viewKyc', text: 'About Kyc' },
			{ to: '/dashboard/viewAdvancedKyc', text: 'About Advanced Kyc' },
			{ to: '/dashboard/viewInstitutionalVerification', text: 'About Institutional Verification' },
		],
	},
	{
		icon: Bell,
		label: 'Proof of Payment',
		routes: ['/dashboard/viewProofs'],
		children: [
			{ to: '/dashboard/viewProofs', text: 'About proof of payment' },
		],
	},
	{
		icon: Bell,
		label: 'Copy Traders Table',
		routes: ['/dashboard/viewCopyTraders'],
		children: [
			{ to: '/dashboard/viewCopyTraders', text: 'About Copy Trader' },
		],
	},
	{
		icon: Bell,
		label: 'Subscribed User Table',
		routes: ['/dashboard/viewCopiedTraders'],
		children: [
			{ to: '/dashboard/viewCopiedTraders', text: 'View All Copy Trader' },
		],
	},
	{
		icon: Bell,
		label: 'Signal Table',
		routes: ['/dashboard/viewSignalTraders'],
		children: [
			{ to: '/dashboard/viewSignalTraders', text: 'About Signal Traders' },
		],
	},
	{
		icon: Bell,
		label: 'Activate Copy Trade',
		routes: ['/dashboard/activateCopy'],
		children: [
			{ to: '/dashboard/activateCopy', text: 'About Activate Copy Traders' },
		],
	},
	{
		icon: Bell,
		label: 'About Staking',
		routes: ['/dashboard/viewAllStaking'],
		children: [
			{ to: '/dashboard/viewAllStaking', text: 'View all Staking' },
		],
	},
	{
		icon: Bell,
		label: 'Stake Request',
		routes: ['/dashboard/viewAllStakeRequest'],
		children: [
			{ to: '/dashboard/viewAllStakeRequest', text: 'View all Stake Request' },
		],
	},
	{
		icon: Bell,
		label: 'Login',
		routes: ['/dashboard/viewAllStakeRequest'],
		children: [{ to: '/dashboard/viewAllStakeRequest', text: 'Login' }],
	},
];


// SidebarItem Component
const SidebarItem = ({
	icon: Icon,
	label,
	children,
	isCollapsed,
	isMobile,
	setIsMobileOpen,
	isOpen,
	onToggle,
}) => {
	const handleClick = () => onToggle(label);

	return (
		<div>
			<button
				onClick={handleClick}
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
						className={`${isOpen ? 'rotate-180' : ''} transition-transform`}
					/>
				)}
			</button>

			{!isCollapsed && isOpen && (
				<div className='pl-10 py-2 space-y-2 text-sm text-gray-300'>
					{children.map(({ to, text }, i) => (
						<NavLink
							key={i}
							to={to}
							onClick={() => isMobile && setIsMobileOpen(false)}
							className={({ isActive }) =>
								clsx(
									'block',
									isActive ? 'text-lime-400 font-medium' : 'hover:text-lime-400'
								)
							}>
							{text}
						</NavLink>
					))}
				</div>
			)}
		</div>
	);
};

// Sidebar Component
const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
	const location = useLocation();
	const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
	const [openDropdown, setOpenDropdown] = useState(null);

	// Auto open correct dropdown on route change
	useEffect(() => {
		const match = items.find((item) =>
			item.routes.some((route) => location.pathname.startsWith(route))
		);
		if (match) {
			setOpenDropdown(match.label);
		}
	}, [location.pathname]);

	const handleDropdownToggle = (label) => {
		setOpenDropdown((prev) => (prev === label ? null : label));
	};

	return (
		<aside
			className={clsx(
				'h-screen overflow-y-auto scrollbar-hide bg-[#111111] border-r border-gray-800 transition-all duration-300 z-50',
				isCollapsed ? 'w-16' : 'w-72',
				isMobileOpen ? 'block fixed top-0 left-0' : 'hidden',
				'md:block md:static'
			)}>
			{/* Mobile Header */}
			<div className='flex justify-between items-center px-4 py-3 md:hidden border-b border-gray-800'>
				<span className='text-lime-400 text-xl font-bold'>Admin Panel</span>
				<button
					onClick={() => setIsMobileOpen(false)}
					className='text-white'>
					<X size={20} />
				</button>
			</div>

			{/* Desktop Title */}
			<div
				className={clsx(
					'p-4 font-bold text-xl text-lime-400 border-b border-gray-800 hidden md:block',
					isCollapsed && 'text-center'
				)}>
				{!isCollapsed ? 'Admin Panel' : 'A'}
			</div>

			{/* Sidebar Menu Items */}
			<nav className='mt-4 space-y-1'>
				{items.map((item) => (
					<SidebarItem
						key={item.label}
						{...item}
						isCollapsed={isCollapsed}
						isMobile={isMobile}
						setIsMobileOpen={setIsMobileOpen}
						isOpen={openDropdown === item.label}
						onToggle={handleDropdownToggle}
					/>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
