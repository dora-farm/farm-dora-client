import { Link } from "react-router-dom";
import { useWishlist } from "./useWishlist";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

export function WishPreview({ userId }) {
  const { wishlistItems, isLoading, imageErrors, formatImageUrl, handleImageError } = useWishlist(userId);

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
                  <ImageNotSupportedIcon 
                    style={{ width: 64, height: 64, color: "#6B7280" }} 
                  />
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-brown truncate">{item.title}</h3>
              <p className="text-text-gray text-sm mt-1">{item.name}</p>
              <div className="mt-2">
                <span className="text-brown font-bold">{(item.price).toLocaleString()}원</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}