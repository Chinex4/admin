import { useState } from 'react';
import { PaintBucket } from 'lucide-react';

const DashboardCards = ({ cardData }) => {
  const [cardBg, setCardBg] = useState('bg-lime-400');

  const handleColorChange = () => {
    // Cycle through a few Tailwind colors — you can expand this as needed
    const colors = ['bg-lime-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500'];
    const currentIndex = colors.indexOf(cardBg);
    const nextIndex = (currentIndex + 1) % colors.length;
    setCardBg(colors[nextIndex]);
  };

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
    <section className='px-4 py-6 space-y-4'>
      <div className='flex justify-end'>
        <button
          onClick={handleColorChange}
          className='flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-1 rounded-md shadow hover:bg-gray-100 transition'
        >
          <PaintBucket size={16} />
          Change Card Color
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`${cardBg} rounded-xl p-6 text-black shadow-lg flex flex-col justify-between`}
          >
            <div className='flex justify-end'>{card.icon}</div>
            <div className='mt-8'>
              <p className='text-lg font-semibold'>{card.label}</p>
              <p className='text-2xl font-bold mt-1'>{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardCards;
