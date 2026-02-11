import React from 'react';
import DepositsTable from '../../components/dashboard/DepositsTable';
import DashboardCards from '../../components/dashboard/DashboardCards';
import { useSelector } from 'react-redux';

const DepositPage = () => {
	const { deposits } = useSelector((state) => state.deposits);

	const normalizeStatus = (value) => String(value || '').toLowerCase();
	const hasDeposits = deposits.length > 0;
	const depositCards = [
		{
			label: 'Total Deposits',
			value: hasDeposits ? deposits.length : 'No data',
			icon: <i className='bi bi-cash-coin text-3xl' />,
		},
		{
			label: 'Approved',
			value: hasDeposits
				? deposits.filter((d) => normalizeStatus(d.status) === 'approved')
						.length
				: 'No data',
			icon: <i className='bi bi-check-circle text-3xl' />,
		},
		{
			label: 'Pending',
			value: hasDeposits
				? deposits.filter((d) => normalizeStatus(d.status) === 'pending')
						.length
				: 'No data',
			icon: <i className='bi bi-clock text-3xl' />,
		},
		{
			label: 'Disapproved',
			value: hasDeposits
				? deposits.filter((d) => normalizeStatus(d.status) === 'disapproved')
						.length
				: 'No data',
			icon: <i className='bi bi-x-circle text-3xl' />,
		},
	];

	return (
		<div className='space-y-5'>
			<DashboardCards cardData={depositCards} />
			<DepositsTable />
		</div>
	);
};

export default DepositPage;
