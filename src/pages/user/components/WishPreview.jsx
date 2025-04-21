import { Link } from "react-router-dom";
import { useWishlist } from "./useWishlist";

export function WishlistItem({ item, imageError, formatPrice, formatImageUrl, onImageError }) {

  const userId = 1;
  const { wishlistItems, isLoading, imageErrors, formatPrice, formatImageUrl, handleImageError } = useWishlist(userId);

  return (
    <Link 
      to={`/product/${item.saleId}`} 
      key={item.id}
      className="bg-white border border-gray-dark rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gray-light flex items-center justify-center">
          {item.saveFile && !imageError ? (
            <img 
              src={formatImageUrl(item.saveFile)}
              alt={item.title} 
              className="w-full h-full object-cover"
              onError={() => onImageError(item.id)}
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
  );
}