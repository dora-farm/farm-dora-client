import { Link } from "react-router-dom";
import { useWishlist } from "./useWishlist";

export function WishPreview({ userId }) {
  const { wishlistItems, isLoading, imageErrors, formatPrice, formatImageUrl, handleImageError } = useWishlist(userId);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col mt-12 mx-8">
      <div className="flex justify-between items-end border-b-2 pb-2 border-gray-dark">
        <h2 className="font-bold text-2xl text-brown">찜한 상품</h2>
        <Link to="/my/user/wishlist" className="text-text-gray text-xs font-bold hover:text-brown transition-colors">
          더보기＞
        </Link>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mt-6">
        {wishlistItems.map(item => (
          <Link 
            to={`/product/${item.saleId}`} 
            key={item.id}
            className="bg-white border border-gray-dark rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <div className="w-full h-full bg-gray-light flex items-center justify-center">
                {item.saveFile && !imageErrors[item.id] ? (
                  <img 
                    src={formatImageUrl(item.saveFile)}
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-brown truncate">{item.title}</h3>
              <p className="text-text-gray text-sm mt-1">{item.name}</p>
              <div className="mt-2">
                <span className="text-brown font-bold">{formatPrice(item.price)}원</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}