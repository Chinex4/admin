import { useState, useEffect, useRef } from "react";
import { PauseCircle } from "lucide-react";

const DashboardCards = ({ cardData, centerSingleCard = false }) => {
  const gradientClasses = [
    "bg-gradient-to-r from-lime-400 to-green-500",
    "bg-gradient-to-r from-blue-500 to-indigo-600",
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-amber-400 to-orange-500",
    "bg-gradient-to-r from-teal-400 to-cyan-500",
    "bg-gradient-to-r from-red-500 to-yellow-500",
  ];

  const [cardBg, setCardBg] = useState(gradientClasses[0]);
  const [isCycling, setIsCycling] = useState(true);
  const intervalRef = useRef(null);

  const handleColorCycle = () => {
    setIsCycling(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isCycling) {
      intervalRef.current = setInterval(() => {
        setCardBg((prev) => {
          const currentIndex = gradientClasses.indexOf(prev);
          const nextIndex = (currentIndex + 1) % gradientClasses.length;
          return gradientClasses[nextIndex];
        });
      }, 2000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isCycling]);

  if (!cardData || cardData.length === 0) {
    return (
      <section className='px-4 py-6'>
        <div className='text-center text-gray-500 dark:text-gray-400'>
          No data available to display dashboard cards.
        </div>
      </section>
    );
  }

  const isSingle = cardData.length === 1 && centerSingleCard;

  return (
    <section className='px-4 py-6 space-y-4'>
      <div className='flex justify-end'>
        {isCycling && (
          <button
            onClick={handleColorCycle}
            className='flex items-center gap-2 text-sm text-white bg-gradient-to-r from-stone-900 to-stone-800 hover:bg-stone-800/80 transition-all duration-300 px-3 rounded-md shadow py-2'
          >
            <PauseCircle size={16} />
            Stop Color Change
          </button>
        )}
      </div>

      <div
        className={`grid gap-6 ${
          isSingle
            ? 'grid-cols-1 justify-center place-items-center'
            : 'grid-cols-1 md:grid-cols-3'
        }`}
      >
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`${cardBg} rounded-xl p-6 text-white shadow-lg flex flex-col justify-between w-full max-w-sm`}
          >
            <div className='flex justify-left'>{card.icon}</div>
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
