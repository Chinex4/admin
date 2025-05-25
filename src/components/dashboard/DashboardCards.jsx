import { Users, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

const cardData = [
	{
		label: 'Total Users',
		value: '1,209',
		icon: <Users size={36} />,
	},
	{
		label: 'Total Deposits',
		value: '$245,310',
		icon: <ArrowDownToLine size={36} />,
	},
	{
		label: 'Total Withdrawals',
		value: '$132,800',
		icon: <ArrowUpToLine size={36} />,
	},
];

const DashboardCards = () => {
	return (
		<section className='grid grid-cols-1 gap-6 px-4 py-6 md:grid-cols-3'>
			{cardData.map((card, index) => (
				<div
					key={index}
					className='bg-gradient-to-b from-[#21618C] to-[#1B4F72] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between'>
					<div className='flex justify-end'>{card.icon}</div>
					<div className='mt-8'>
						<p className='text-lg font-semibold'>{card.label}</p>
						<p className='text-2xl font-bold mt-1'>{card.value}</p>
					</div>
				</div>
			))}
		</section>
	);
};

export default DashboardCards;
