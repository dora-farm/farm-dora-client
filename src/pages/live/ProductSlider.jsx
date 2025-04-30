import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductSlider = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // 화면에 보여줄 아이템 개수 (반응형)
  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4; // lg
      if (window.innerWidth >= 768) return 3; // md
      if (window.innerWidth >= 640) return 2; // sm
      return 1; // xs
    }
    return 3; // 기본값
  };
  
  const [visibleItems, setVisibleItems] = useState(getVisibleItems());
  
  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 자동 슬라이드 기능
  useEffect(() => {
    let intervalId;
    
    if (isAutoPlaying && products.length > visibleItems) {
      intervalId = setInterval(() => {
        handleNext();
      }, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentIndex, isAutoPlaying, products.length, visibleItems]);
  
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? Math.max(0, products.length - visibleItems) : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex >= Math.max(0, products.length - visibleItems) ? 0 : prevIndex + 1
    );
  };
  
  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };
  
  // 빈 배열 체크
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        판매중인 상품이 없습니다.
      </div>
    );
  }
  
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      <h3 className="text-xl font-bold mb-6 text-green-800 border-b pb-2">판매자의 다른 상품</h3>
      
      <div className="relative overflow-hidden">
        {/* 슬라이더 컨트롤 - 이전 버튼 */}
        <button 
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
          aria-label="이전 상품"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        
        {/* 슬라이더 내용 */}
        <div className="flex transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}>
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 transition-opacity duration-300`}
              style={{ opacity: 1 }}
            >
              <a 
                href={`/sale/${product.id}`} 
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.mainImage || '/api/placeholder/400/300'} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/300';
                      e.target.alt = '이미지를 불러올 수 없습니다';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 truncate">{product.title}</h4>
                  <p className="text-sm text-gray-500 mb-1 truncate">{product.name}</p>
                  <p className="text-base text-gray-600 font-medium">
                    {product.price.toLocaleString()}원
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
        
        {/* 슬라이더 컨트롤 - 다음 버튼 */}
        <button 
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
          aria-label="다음 상품"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>
      </div>
      
      {/* 인디케이터 (페이지 도트) */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(products.length / visibleItems) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index * visibleItems)}
            className={`w-2 h-2 rounded-full ${
              index * visibleItems <= currentIndex && 
              currentIndex < (index + 1) * visibleItems
                ? 'bg-green-600'
                : 'bg-gray-300'
            }`}
            aria-label={`${index + 1}페이지로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;