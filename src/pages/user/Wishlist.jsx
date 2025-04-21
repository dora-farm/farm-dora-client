import React from 'react';
import GreenCircleCheckbox from '../../common/components/GreenCircleCheckbox';
// MUI 아이콘 임포트
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

function Wishlist() {
  // 더미 데이터
  const wishlistItems = [
    {
      id: 1,
      title: '25년 제주 햇감자 포슬포슬 훈감자 제철 수미감자',
      description: '🥔25년제주햇감자/무료배송🥔',
      optionDescription: '제주햇감자(대)_3kg / 1개 (+5,000원)',
      sellerName: '강원도의 자존심 (주)수미감자',
      price: 48900,
      imageUrl: 'https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/%EC%82%AC%EA%B3%BC.jpg?type=f&w=216&h=180'
    },
    {
      id: 2,
      title: '25년 제주 햇감자 포슬포슬 훈감자 제철 수미감자',
      description: '🥔25년제주햇감자/무료배송🥔',
      optionDescription: '제주햇감자(대)_3kg / 1개 (+5,000원)',
      sellerName: '강원도의 자존심 (주)수미감자',
      price: 48900,
      imageUrl: 'https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/%EC%82%AC%EA%B3%BC.jpg?type=f&w=216&h=180'
    },
    {
      id: 3,
      title: '25년 제주 햇감자 포슬포슬 훈감자 제철 수미감자',
      description: '🥔25년제주햇감자/무료배송🥔',
      optionDescription: '제주햇감자(대)_3kg / 1개 (+5,000원)',
      sellerName: '강원도의 자존심 (주)수미감자',
      price: 48900,
      imageUrl: 'https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/%EC%82%AC%EA%B3%BC.jpg?type=f&w=216&h=180'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">찜 리스트</h1>
      
      <div className="border-t-2 border-b-2 border-gray-dark py-4 mb-4">
        <div className="flex items-center">
          <GreenCircleCheckbox />
          <span className="font-medium">전체 선택</span>
          <span className="ml-2 text-gray-600">(총 {wishlistItems.length}개)</span>
          <button className="ml-4 px-3 py-1 bg-red-500 text-white text-sm rounded">선택 삭제</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-0 border-b-2 border-gray-dark">
        
        {wishlistItems.map(item => (
          <div key={item.id} className="grid grid-cols-2 py-4 border-t border-gray-300">
            <div className="flex">
              <div className="flex items-center mr-4">
                <GreenCircleCheckbox />
              </div>
              
              <div className="flex flex-1">
                <div className="w-24 h-24 mr-4 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                  <p className="text-sm text-gray-600 mb-1">{item.optionDescription}</p>
                  <p className="text-sm text-gray-600">{item.sellerName}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center mb-4">
                <button className="w-8 h-8 border border-gray-300 flex items-center justify-center">
                  <RemoveIcon fontSize="small" />
                </button>
                <input
                  type="text"
                  className="w-10 h-8 border-t border-b border-gray-300 text-center"
                  value="1"
                  readOnly
                />
                <button className="w-8 h-8 border border-gray-300 flex items-center justify-center">
                  <AddIcon fontSize="small" />
                </button>
                
                <button className="ml-4 text-gray-400">
                  <CloseIcon fontSize="small" />
                </button>
              </div>
              
              <div className="text-lg font-bold mb-2">
                {item.price.toLocaleString()}원
              </div>
              
              <button className="px-4 py-2 bg-teal-500 text-white rounded-md">
                구매하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;