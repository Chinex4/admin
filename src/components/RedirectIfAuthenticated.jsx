import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RedirectIfAuthenticated = ({ children }) => {
	const navigate = useNavigate();

	useEffect(() => {
		const adminId = Cookies.get('admin_id');

		if (adminId) {
			// You can optionally decode/validate more if you want
			navigate('/dashboard/users', { replace: true });
		}
	}, [navigate]);

	return children;
};

export default RedirectIfAuthenticated;
