const DashboardCards = ({ cardData }) => {
  if (!cardData || cardData.length === 0) {
    return (
      <section className='px-4 py-6'>
        <div className='text-center text-gray-500 dark:text-gray-400'>
          No data available to display dashboard cards.
        </div>
      </section>
    );
  }

  return (
    <section className='grid grid-cols-1 gap-6 px-4 py-6 md:grid-cols-3'>
      {cardData.map((card, index) => (
        <div
          key={index}
          className='bg-gradient-to-b from-[#21618C] to-[#1B4F72] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between'
        >
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
