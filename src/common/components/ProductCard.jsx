import React from 'react';
import { Link } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

function ProductCard({ saleId, title, mainImage, minPrice, liked, onToggleLike }) {
  return (
    <Link
      to={`/sale/${saleId}`}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={mainImage || '/default-image.png'}
          alt={title}
          className="w-full h-48 object-cover bg-gray-100"
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">{title}</h3>
          <div onClick={(e) => { e.preventDefault(); onToggleLike(saleId); }}>
            {liked ? (
              <Favorite className="text-danger" style={{ strokeWidth: 0.5 }} />
            ) : (
              <FavoriteBorder className="text-gray-500" />
            )}
          </div>
        </div>
        <p className="text-lg font-bold mt-2">{minPrice.toLocaleString()}원</p>
      </div>
    </Link>
  );
}

export default ProductCard;