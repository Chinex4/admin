import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/thunks/authThunk";
import Cookies from "js-cookie";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser()); // ✅ call the thunk
    Cookies.remove("admin_id"); // ✅ remove the cookie
    navigate("/login"); // ✅ redirect to login
  };

  return (
    <div className='h-screen w-full admin-shell flex overflow-hidden'>
      {/* Fixed Sidebar */}
      <div ref={sidebarRef} className='h-full'>
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>

      {/* Scrollable Main Content */}
      <div className='flex-1 flex flex-col h-full overflow-hidden'>
        {/* Topbar */}
        <header className='topbar flex items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-3'>
            <button
              className='icon-button md:hidden'
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <i className='bi bi-list text-lg' />
            </button>
            <button
              className='icon-button hidden md:flex'
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <i className='bi bi-layout-sidebar-inset text-lg' />
            </button>
            <div className='hidden md:flex flex-col leading-tight'>
              <span className='text-[10px] uppercase tracking-[0.3em] text-slate-400'>
                Admin Console
              </span>
              <span className='text-lg font-semibold text-slate-100'>
                Overview
              </span>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden md:flex items-center gap-2 rounded-full border border-[color:var(--color-stroke)] bg-[color:var(--color-surface-1)] px-3 py-1'>
              <i className='bi bi-search text-slate-400' />
              <input
                type='text'
                placeholder='Search'
                className='bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none'
              />
            </div>
            <button className='icon-button'>
              <i className='bi bi-bell text-base' />
            </button>
            <button className='icon-button'>
              <i className='bi bi-moon text-base' />
            </button>
            <div onClick={handleLogout}>
              <button className='button-danger'>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main scroll area */}
        <main className='flex-1 overflow-y-auto px-6 py-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

