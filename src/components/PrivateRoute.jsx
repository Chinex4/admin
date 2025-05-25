import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
	const isAuthenticated = !!localStorage.getItem('token'); // or use a Redux/auth context

	return !isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate
			to='/login'
			replace
		/>
	);
};

export default PrivateRoute;
