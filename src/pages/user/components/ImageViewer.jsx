import React from 'react';

function ImageViewer({ images, currentIndex, onClose, onChangeIndex }) {
  // 이전 이미지로 이동
  const goToPrevImage = () => {
    onChangeIndex((currentIndex - 1 + images.length) % images.length);
  };

  // 다음 이미지로 이동
  const goToNextImage = () => {
    onChangeIndex((currentIndex + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 text-xl z-10"
        >
          ✕
        </button>
        
        {/* 현재 이미지 */}
        <div className="flex items-center justify-center h-[80vh]">
          <img 
            src={images[currentIndex]} 
            alt="리뷰 이미지" 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        {/* 이미지 넘기기 버튼 */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
            <button 
              onClick={goToPrevImage}
              className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
            >
              ←
            </button>
            <button 
              onClick={goToNextImage}
              className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2"
            >
              →
            </button>
          </div>
        )}
        
        {/* 이미지 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => onChangeIndex(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? 'bg-white' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageViewer;