import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const items = [
  {
    icon: 'bi-people',
    label: 'Users Table',
    routes: ['/dashboard/users'],
    children: [{ to: '/dashboard/users', text: 'Everything About the User' }],
  },
  {
    icon: 'bi-credit-card-2-front',
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
    icon: 'bi-arrow-left-right',
    label: 'Fund Transfers',
    routes: ['/dashboard/viewFundTransfers'],
    children: [
      { to: '/dashboard/viewFundTransfers', text: 'View Fund Transfers' },
    ],
  },
  {
    icon: 'bi-shuffle',
    label: 'Convert Orders',
    routes: ['/dashboard/viewConvertOrders'],
    children: [
      { to: '/dashboard/viewConvertOrders', text: 'View Convert Orders' },
    ],
  },
  {
    icon: 'bi-diagram-3',
    label: 'Referral Table',
    routes: ['/dashboard/viewReferrals'],
    children: [{ to: '/dashboard/viewReferrals', text: 'View Referrals' }],
  },
  {
    icon: 'bi-bell',
    label: 'Notifications',
    routes: ['/dashboard/viewNotifications'],
    children: [{ to: '/dashboard/viewNotifications', text: 'View Notifications' }],
  },
  {
    icon: 'bi-graph-up',
    label: 'Trade Table',
    routes: ['/dashboard/viewTrades'],
    children: [{ to: '/dashboard/viewTrades', text: 'About Trade' }],
  },
  {
    icon: 'bi-cash-stack',
    label: 'Earning Table',
    routes: ['/dashboard/viewTradeEarnings'],
    children: [{ to: '/dashboard/viewTradeEarnings', text: 'Trade Earnings' }],
  },
  {
    icon: 'bi-wallet2',
    label: 'Wallet Table',
    routes: ['/dashboard/viewBrokersWallet'],
    children: [
      { to: '/dashboard/viewBrokersWallet', text: "About Broker's Wallet" },
    ],
  },
  {
    icon: 'bi-shield-check',
    label: 'Identity Verification (KYC)',
    routes: ['/dashboard/viewProofs', '/dashboard/viewKyc'],
    children: [
      { to: '/dashboard/viewKyc', text: 'About Kyc' },
      { to: '/dashboard/viewAdvancedKyc', text: 'About Advanced Kyc' },
      {
        to: '/dashboard/viewInstitutionalVerification',
        text: 'About Institutional Verification',
      },
    ],
  },
  {
    icon: 'bi-receipt',
    label: 'Proof of Payment',
    routes: ['/dashboard/viewProofs'],
    children: [{ to: '/dashboard/viewProofs', text: 'About proof of payment' }],
  },
  {
    icon: 'bi-person-plus',
    label: 'Copy Traders Table',
    routes: ['/dashboard/viewCopyTraders', '/dashboard/viewCopiedTraders'],
    children: [
      { to: '/dashboard/viewCopyTraders', text: 'About Copy Trade' },
      { to: '/dashboard/viewCopiedTraders', text: 'Copy Trade Orders' },
    ],
  },
  {
    icon: 'bi-broadcast',
    label: 'Signal Table',
    routes: ['/dashboard/viewSignalTraders'],
    children: [
      { to: '/dashboard/viewSignalTraders', text: 'About Signal Traders' },
    ],
  },
  {
    icon: 'bi-lightning-charge',
    label: 'Activate Copy Trade',
    routes: ['/dashboard/activateCopy'],
    children: [
      { to: '/dashboard/activateCopy', text: 'About Activate Copy Traders' },
    ],
  },
  {
    icon: 'bi-gem',
    label: 'About Staking',
    routes: ['/dashboard/viewAllStaking'],
    children: [{ to: '/dashboard/viewAllStaking', text: 'View all Staking' }],
  },
	{
		icon: 'bi-clipboard-check',
		label: 'Stake Request',
		routes: ['/dashboard/viewAllStakeRequest'],
		children: [
			{ to: '/dashboard/viewAllStakeRequest', text: 'View all Stake Request' },
		],
	},
	{
		icon: 'bi-arrow-left-right',
		label: 'P2P',
		routes: ['/dashboard/viewP2POrders', '/dashboard/p2p'],
		children: [
			{ to: '/dashboard/viewP2POrders', text: 'View P2P Orders' },
			{ to: '/dashboard/p2p', text: 'P2P' },
		],
	},
  {
    icon: 'bi-box-arrow-in-right',
    label: 'Login',
    routes: ['/dashboard/viewAllStakeRequest'],
    children: [{ to: '/dashboard/viewAllStakeRequest', text: 'Login' }],
  },
];

// SidebarItem Component
const SidebarItem = ({
  icon,
  label,
  children,
  isCollapsed,
  isMobile,
  setIsMobileOpen,
  isOpen,
  onToggle,
  isActive,
}) => {
  const handleClick = () => onToggle(label);

  return (
    <div>
      <button
        onClick={handleClick}
        className={clsx(
          'sidebar-item flex items-center justify-between w-full px-4 py-3 rounded-xl',
          isCollapsed && 'justify-center px-2',
          isActive && !isCollapsed && 'sidebar-pill'
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              'inline-flex items-center justify-center',
              isActive && !isCollapsed ? 'sidebar-pill-icon' : 'text-slate-300'
            )}
          >
            <i className={`bi ${icon} text-base`} />
          </span>
          {!isCollapsed && (
            <span
              className={clsx(
                'sidebar-label flex-1 text-left truncate',
                label.includes('Identity Verification') && 'text-xs'
              )}
            >
              {label}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <i
            className={`bi bi-chevron-down text-xs sidebar-chevron ${isOpen ? 'rotate-180' : ''} transition-transform`}
          />
        )}
      </button>

      {!isCollapsed && isOpen && (
        <div className="pl-10 py-2 space-y-2 text-sm text-slate-500">
          {children.map(({ to, text }, i) => (
            <NavLink
              key={i}
              to={to}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={({ isActive }) =>
                clsx('block', isActive ? 'sidebar-link-active' : 'sidebar-link')
              }
            >
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredItems = items
    .map((item) => {
      const matchesLabel = item.label.toLowerCase().includes(normalizedSearch);
      const matchedChildren = item.children.filter((child) =>
        child.text.toLowerCase().includes(normalizedSearch)
      );
      if (!normalizedSearch || matchesLabel || matchedChildren.length > 0) {
        return {
          ...item,
          children:
            matchedChildren.length > 0 ? matchedChildren : item.children,
          forceOpen: normalizedSearch.length > 0 && matchedChildren.length > 0,
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <aside
      className={clsx(
        'h-screen overflow-y-auto scrollbar-hide sidebar-shell transition-all duration-300 z-50',
        isCollapsed ? 'w-16' : 'w-72',
        isMobileOpen ? 'block fixed top-0 left-0' : 'hidden',
        'md:block md:static'
      )}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center px-4 py-3 md:hidden border-b border-[color:var(--color-stroke)]">
        <span className="sidebar-title text-xl font-bold">Admin Panel</span>
        <button onClick={() => setIsMobileOpen(false)} className="icon-button">
          <i className="bi bi-x-lg text-sm" />
        </button>
      </div>

      {/* Desktop Title */}
      <div
        className={clsx(
          'p-4 border-b border-[color:var(--color-stroke)] hidden md:block',
          isCollapsed && 'text-center'
        )}
      >
        <div className="flex items-center gap-3">
          <span className="sidebar-avatar">G</span>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-slate-200 text-sm font-semibold">
                Guy Hawkins
              </span>
              <span className="text-[11px] sidebar-muted">Administrator</span>
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="px-4 pt-4">
          <div className="sidebar-search">
            <i className="bi bi-search text-sm" />
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Sidebar Menu Items */}
      <div className="sidebar-section">Dashboards</div>
      <nav className="mt-2 space-y-2 px-3">
        {filteredItems.length === 0 && (
          <div className="px-3 py-2 text-xs text-slate-500">No matches</div>
        )}
        {filteredItems.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            setIsMobileOpen={setIsMobileOpen}
            isOpen={item.forceOpen || openDropdown === item.label}
            onToggle={handleDropdownToggle}
            isActive={openDropdown === item.label}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
