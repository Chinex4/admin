import React from 'react';
import DashboardCards from '../../components/dashboard/DashboardCards';
import WithdrawTable from '../../components/dashboard/WithdrawalTable';

const WithdrawPage = () => {
	return (
		<div className='space-y-5'>
			<DashboardCards />
			<WithdrawTable />
		</div>
	);
};

export default WithdrawPage;
