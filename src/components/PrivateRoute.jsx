import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
	const isAuthenticated = !!localStorage.getItem('admin_id'); 

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
