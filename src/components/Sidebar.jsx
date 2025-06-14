import { useEffect, useState } from "react";
import {
  ChevronDown,
  Menu,
  Users,
  Monitor,
  Wallet,
  Bell,
  PieChart,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";

// SidebarItem Component
const SidebarItem = ({
  icon: Icon,
  label,
  children,
  isCollapsed,
  routes = [],
  isMobile,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isActive = routes.some((route) =>
      location.pathname.startsWith(route)
    );
    setOpen(isActive);
  }, [location.pathname, routes]);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        onClick={handleClick}
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
          {children.map(({ to, text }, i) => (
            <NavLink
              key={i}
              to={to}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "block",
                  isActive ? "text-lime-400 font-medium" : "hover:text-lime-400"
                )
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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <aside
      className={clsx(
        "h-screen overflow-y-auto scrollbar-hide bg-[#111111] border-r border-gray-800 transition-all duration-300 z-50",
        isCollapsed ? "w-16" : "w-72",
        isMobileOpen ? "block fixed top-0 left-0" : "hidden",
        "md:block md:static"
      )}
    >
      {/* Mobile Header */}
      <div className='flex justify-between items-center px-4 py-3 md:hidden border-b border-gray-800'>
        <span className='text-lime-400 text-xl font-bold'>Admin Panel</span>
        <button onClick={() => setIsMobileOpen(false)} className='text-white'>
          <X size={20} />
        </button>
      </div>

      {/* Desktop Header */}
      <div
        className={clsx(
          "p-4 font-bold text-xl text-lime-400 border-b border-gray-800 hidden md:block",
          isCollapsed && "text-center"
        )}
      >
        {!isCollapsed ? "Admin Panel" : "A"}
      </div>

      {/* Menu */}
      <nav className='mt-4 space-y-1'>
        <SidebarItem
          icon={Users}
          label='Users Table'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/users"]}
          children={[
            { to: "/dashboard/users", text: "Everything About the User" },
          ]}
        />

        <SidebarItem
          icon={Monitor}
          label='Transaction Table'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={[
            "/dashboard/viewDeposits",
            "/dashboard/viewWithdrawal",
            "/dashboard/viewProfits",
            "/dashboard/viewLosses",
          ]}
          children={[
            { to: "/dashboard/viewDeposits", text: "About Deposit" },
            {
              to: "/dashboard/viewWithdrawal",
              text: "About Crypto Withdrawal",
            },
            { to: "/dashboard/viewProfits", text: "About Profit" },
            { to: "/dashboard/viewLosses", text: "About Loss" },
          ]}
        />

        <SidebarItem
          icon={PieChart}
          label='Trade Table'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewTrades"]}
          children={[{ to: "/dashboard/viewTrades", text: "About Trade" }]}
        />

        <SidebarItem
          icon={Wallet}
          label='Wallet Table'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewBrokersWallet"]}
          children={[
            {
              to: "/dashboard/viewBrokersWallet",
              text: "About Broker's Wallet",
            },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='KYC/Proof of payment'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewProofs", "/dashboard/viewKyc"]}
          children={[
            { to: "/dashboard/viewProofs", text: "About proof of payment" },
            { to: "/dashboard/viewKyc", text: "About Kyc" },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='Copy Traders Table'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewCopyTraders"]}
          children={[
            { to: "/dashboard/viewCopyTraders", text: "About Copy Trader" },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='Subscribed User Table'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewCopiedTraders"]}
          children={[
            {
              to: "/dashboard/viewCopiedTraders",
              text: "View All Copy Trader",
            },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='Signal Table'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewSignalTraders"]}
          children={[
            {
              to: "/dashboard/viewSignalTraders",
              text: "About SIgnal Traders",
            },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='Activate Copy Trade'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/activateCopy"]}
          children={[
            {
              to: "/dashboard/activateCopy",
              text: "About Activate Copy Traders",
            },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='About Staking'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewAllStaking"]}
          children={[
            { to: "/dashboard/viewAllStaking", text: "View all Staking" },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='Stake Request'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewAllStakeRequest"]}
          children={[
            {
              to: "/dashboard/viewAllStakeRequest",
              text: "View all Stake Request",
            },
          ]}
        />

        <SidebarItem
          icon={Bell}
          label='Login'
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
          routes={["/dashboard/viewAllStakeRequest"]}
          children={[{ to: "/dashboard/viewAllStakeRequest", text: "Login" }]}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
