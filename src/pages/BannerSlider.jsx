import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerSlider = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, banners.length]);

  if (!banners || banners.length === 0) {
    return <div className="text-center py-8 text-gray-500">배너가 없습니다.</div>;
  }

  return (
    <div className="relative w-full mb-12">
      <div className="relative overflow-hidden shadow-lg h-64 w-full">
        {/* 이미지 슬라이드 영역 */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            width: `${banners.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / banners.length)}%)`,
          }}
        >
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className="flex-none w-full h-64"
              style={{ width: `${100 / banners.length}%` }}
            >
              <img
                src={banner.imageUrl}
                alt={`Banner ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* 이전 버튼 */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-1 rounded-full shadow-md"
        >
          <ChevronLeft />
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white p-1 rounded-full shadow-md"
        >
          <ChevronRight />
        </button>
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center mt-3 space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-green-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;