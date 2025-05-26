import React from 'react';
import DepositsTable from '../../components/dashboard/DepositsTable';
import DashboardCards from '../../components/dashboard/DashboardCards';

const DepositPage = () => {
	return (
		<div className='space-y-5'>
			<DashboardCards />
			<DepositsTable />
		</div>
	);
};

export default DepositPage;
