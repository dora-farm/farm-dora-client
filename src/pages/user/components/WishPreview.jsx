import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import WishlistItem from "./WishlistItem";

function WishPreview({ userId }) {
  const {
    wishlistItems,
    isLoading,
    imageErrors,
    formatImageUrl,
    handleImageError
  } = useWishlist(userId, true);


  if (isLoading) {
    return (
      <div className="flex flex-col mt-12 mx-8">
        <div className="flex justify-between items-end border-b-2 pb-2 border-gray-dark">
          <h2 className="font-bold text-2xl text-brown">찜한 상품</h2>
          <Link to="/my/user/wishlist" className="text-text-gray text-xs font-bold hover:text-brown transition-colors">
            더보기＞
          </Link>
        </div>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col mt-12 mx-8">
        <div className="flex justify-between items-end border-b-2 pb-2 border-gray-dark">
          <h2 className="font-bold text-2xl text-brown">찜한 상품</h2>
          <Link to="/my/user/wishlist" className="text-text-gray text-xs font-bold hover:text-brown transition-colors">
            더보기＞
          </Link>
        </div>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500">찜한 상품이 없습니다.</p>
        </div>
      </div>
    );
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
          <WishlistItem
            key={item.saleId}
            item={item}
            formatImageUrl={formatImageUrl}
            onImageError={handleImageError}
            imageError={imageErrors[item.likeId]}
            previewMode={true}
          />
        ))}
      </div>
    </div>
  );
}

export default WishPreview;