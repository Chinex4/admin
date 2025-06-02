import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const sidebarRef = useRef(null);

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
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="h-screen w-full bg-[#171717] text-white flex overflow-hidden">
			{/* Fixed Sidebar */}
			<div ref={sidebarRef} className="h-full">
				<Sidebar
					isCollapsed={isCollapsed}
					isMobileOpen={isMobileOpen}
					setIsMobileOpen={setIsMobileOpen}
				/>
			</div>

			{/* Scrollable Main Content */}
			<div className="flex-1 flex flex-col h-full overflow-hidden">
				{/* Topbar */}
				<header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#111111]">
					<button
						className="text-white md:hidden"
						onClick={() => setIsMobileOpen(!isMobileOpen)}
					>
						<Menu />
					</button>
					<button
						className="hidden md:block text-white"
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						<Menu />
					</button>

					<div>
						<button className='bg-red-500 px-6 py-3 rounded-md text-white'>
							Log Out
						</button>
					</div>
				</header>

				{/* Main scroll area */}
				<main className="flex-1 overflow-y-auto px-4 py-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
