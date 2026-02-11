import { useState, useEffect, useRef } from "react";

const DashboardCards = ({ cardData, centerSingleCard = false }) => {
  const gradientClasses = [
    "metric-card",
    "metric-card variant-blue",
    "metric-card variant-rose",
    "metric-card variant-amber",
    "metric-card variant-indigo",
    "metric-card variant-teal",
    "metric-card variant-violet",
    "metric-card variant-emerald",
    "metric-card variant-orange",
    "metric-card variant-cyan",
    "metric-card variant-lime",
    "metric-card variant-pink",
    "metric-card variant-sky",
    "metric-card variant-slate",
  ];

  const [colorIndex, setColorIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(true);
  const intervalRef = useRef(null);

  const handleColorCycle = () => {
    setIsCycling(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isCycling) {
      intervalRef.current = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % gradientClasses.length);
      }, 2000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isCycling]);

  if (!cardData || cardData.length === 0) {
    return (
      <section className='px-4 py-6'>
        <div className='text-center muted-text'>
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
            className='button-ghost flex items-center gap-2 text-sm'
          >
            <i className='bi bi-pause-circle text-base' />
            Stop Color Change
          </button>
        )}
      </div>

      <div
        className={`grid gap-6 ${
          isSingle
            ? 'grid-cols-1'
            : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`${gradientClasses[colorIndex]} flex flex-col justify-between w-full`}
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




