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

function App() {
	return (
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
				element={<Login />}
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
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
