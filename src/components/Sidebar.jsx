import { useState } from "react";
import {
  ChevronDown,
  Menu,
  Users,
  Monitor,
  Wallet,
  Bell,
  PieChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const SidebarItem = ({ icon: Icon, label, children, isCollapsed }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex items-center justify-between w-full px-4 py-3 text-white hover:bg-[#1f1f1f]",
          isCollapsed && "justify-center px-2"
        )}
      >
        <div className='flex items-center gap-3'>
          <Icon size={18} />
          {!isCollapsed && <span>{label}</span>}
        </div>
        {!isCollapsed && (
          <ChevronDown
            size={18}
            className={`${open ? "rotate-180" : ""} transition-transform`}
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

import { X } from "lucide-react"; // already using Menu, import X too

const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
  return (
    <aside
      className={clsx(
        "h-screen overflow-y-auto scrollbar-hide bg-[#111111] border-r border-gray-800 transition-all duration-300",
        isCollapsed ? "w-16" : "w-72",
        "hidden md:block"
      )}
    >
      {/* Mobile close button */}
      <div className='flex justify-between items-center px-4 py-3 md:hidden border-b border-gray-800'>
        <span className='text-lime-400 text-xl font-bold'>Admin Panel</span>
        <button onClick={() => setIsMobileOpen(false)} className='text-white'>
          <X size={20} />
        </button>
      </div>

      {/* Desktop title */}
      <div
        className={clsx(
          "p-4 font-bold text-xl text-lime-400 border-b border-gray-800 hidden md:block",
          isCollapsed && "text-center"
        )}
      >
        {!isCollapsed ? "Admin Panel" : "A"}
      </div>

      <nav className='mt-4 space-y-1'>
        <SidebarItem icon={Users} label='Users Table' isCollapsed={isCollapsed}>
          <Link to='/dashboard/users' className='block hover:text-lime-400'>
            Everything About the User
          </Link>
          {/* <Link
						to='/dashboard/users/kyc'
						className='block hover:text-lime-400'>
						KYC Info
					</Link> */}
        </SidebarItem>

        <SidebarItem
          icon={Monitor}
          label='Transaction Table'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewDeposits'
            className='block hover:text-lime-400'
          >
            About Deposit
          </Link>
          <Link
            to='/dashboard/viewWithdrawal'
            className='block hover:text-lime-400'
          >
            About Crypto Withdrawal
          </Link>
          <Link
            to='/dashboard/viewProfits'
            className='block hover:text-lime-400'
          >
            About Profit
          </Link>
          <Link
            to='/dashboard/viewLosses'
            className='block hover:text-lime-400'
          >
            About Loss
          </Link>
        </SidebarItem>

        <SidebarItem
          icon={PieChart}
          label='Trade Table'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewTrades'
            className='block hover:text-lime-400'
          >
            About Trade
          </Link>
        </SidebarItem>

        <SidebarItem
          icon={Wallet}
          label='Wallet Table'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewBrokersWallet'
            className='block hover:text-lime-400'
          >
            About Broker's Wallet
          </Link>
        </SidebarItem>

        <SidebarItem
          icon={Bell}
          label='KYC/Proof of payment'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewProofs'
            className='block hover:text-lime-400'
          >
            About proof of payment
          </Link>
          <Link to='/dashboard/viewKyc' className='block hover:text-lime-400'>
            About Kyc
          </Link>
        </SidebarItem>
        <SidebarItem
          icon={Bell}
          label='Copy Traders Table'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewCopyTraders'
            className='block hover:text-lime-400'
          >
            About Copy Trader
          </Link>
        </SidebarItem>
        <SidebarItem
          icon={Bell}
          label='Subscribed User Table'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewCopiedTraders'
            className='block hover:text-lime-400'
          >
            View All Copy Trader
          </Link>
        </SidebarItem>
        <SidebarItem icon={Bell} label='Signal Table' isCollapsed={isCollapsed}>
          <Link
            to='/dashboard/viewSignalTraders'
            className='block hover:text-lime-400'
          >
            About SIgnal Traders
          </Link>
        </SidebarItem>
        <SidebarItem
          icon={Bell}
          label='Activate Copy Trade'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/activateCopy'
            className='block hover:text-lime-400'
          >
            About Activate Copy Traders
          </Link>
        </SidebarItem>
        <SidebarItem
          icon={Bell}
          label='About Staking'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewAllStaking'
            className='block hover:text-lime-400'
          >
            View all Staking
          </Link>
        </SidebarItem>
        <SidebarItem
          icon={Bell}
          label='Stake Request'
          isCollapsed={isCollapsed}
        >
          <Link
            to='/dashboard/viewAllStakeRequest'
            className='block hover:text-lime-400'
          >
            View all Stake Request
          </Link>
        </SidebarItem>
        <SidebarItem icon={Bell} label='Login' isCollapsed={isCollapsed}>
          <Link
            to='/dashboard/viewAllStakeRequest'
            className='block hover:text-lime-400'
          >
            Login
          </Link>
        </SidebarItem>
      </nav>
    </aside>
  );
};

export default Sidebar;
