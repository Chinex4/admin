import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import UsersPage from './pages/dashboard/UsersPage';
import PrivateRoute from './components/PrivateRoute';
import DepositPage from './pages/dashboard/DepositPage';
import WithdrawPage from './pages/dashboard/WithdrawPage';
import ProfitPage from './pages/dashboard/ProfitPage';
import LossesPage from './pages/dashboard/LossesPage';
import TradePage from './pages/dashboard/TradePage';
import WalletPage from './pages/dashboard/WalletPage';
import ProofPage from './pages/dashboard/ProofPage';
import KYCPage from './pages/dashboard/KYCPage';
import CopyTradersPage from './pages/dashboard/CopyTradersPage';
import CopiedTradersPage from './pages/dashboard/CopiedTradersPage';
import SignalPage from './pages/dashboard/SignalPage';
import ActivateCopyPage from './pages/dashboard/ActivateCopyPage';
import StakingPage from './pages/dashboard/StakingPage';
import StakingRequestPage from './pages/dashboard/StakingRequestPage';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import { Toaster } from 'react-hot-toast';
import AdvancedKYCPage from './pages/dashboard/AdvancedKYCPage';
import InstitutionalVerificationPage from './pages/dashboard/InstitutionalVerificationPage';
import P2POrdersPage from './pages/dashboard/P2POrdersPage';
import P2PPage from './pages/dashboard/P2PPage';

function App() {
	return (
		<>
		<Toaster position="top-center" reverseOrder={false} />
		<Routes>
			{/* Redirect root to login */}
			<Route
				path='/'
				element={
					<Navigate
						to='/login'
						replace
					/>
				}
			/>

			{/* Public Route */}
			<Route
				path='/login'
				element={
					<RedirectIfAuthenticated>
						<Login />
					</RedirectIfAuthenticated>
				}
			/>

			{/* Protected Routes */}
			<Route element={<PrivateRoute />}>
				<Route
					path='/dashboard'
					element={<DashboardLayout />}>
					{/* Redirect /dashboard to /dashboard/users */}
					<Route
						index
						element={
							<Navigate
								to='users'
								replace
							/>
						}
					/>

					<Route
						path='users'
						element={<UsersPage />}
					/>
					<Route
						path='viewDeposits'
						element={<DepositPage />}
					/>
					<Route
						path='viewWithdrawal'
						element={<WithdrawPage />}
					/>
					<Route
						path='viewProfits'
						element={<ProfitPage />}
					/>
					<Route
						path='viewLosses'
						element={<LossesPage />}
					/>
					<Route
						path='viewTrades'
						element={<TradePage />}
					/>
					<Route
						path='viewBrokersWallet'
						element={<WalletPage />}
					/>
					<Route
						path='viewProofs'
						element={<ProofPage />}
					/>
					<Route
						path='viewKyc'
						element={<KYCPage />}
					/>
					<Route
						path='viewAdvancedKyc'
						element={<AdvancedKYCPage />}
					/>
					<Route
						path='viewInstitutionalVerification'
						element={<InstitutionalVerificationPage />}
					/>
					<Route
						path='viewCopyTraders'
						element={<CopyTradersPage />}
					/>
					<Route
						path='viewCopiedTraders'
						element={<CopiedTradersPage />}
					/>
					<Route
						path='viewSignalTraders'
						element={<SignalPage />}
					/>
					<Route
						path='activateCopy'
						element={<ActivateCopyPage />}
					/>
					<Route
						path='viewAllStaking'
						element={<StakingPage />}
					/>
					<Route
						path='viewAllStakeRequest'
						element={<StakingRequestPage />}
					/>
					<Route
						path='viewP2POrders'
						element={<P2POrdersPage />}
					/>
					<Route
						path='p2p'
						element={<P2PPage />}
					/>
				</Route>
			</Route>
		</Routes>
		
		</>
	);
}

export default App;
