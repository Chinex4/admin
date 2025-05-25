import React from 'react';
import DashboardCards from '../../components/dashboard/DashboardCards';
import UsersTable from '../../components/dashboard/UsersTable';

const UsersPage = () => {
	return (
		<div className='space-y-5'>
			<DashboardCards />
			<UsersTable />
		</div>
	);
};

export default UsersPage;
