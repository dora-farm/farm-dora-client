import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getCookie } from '../../common/utils/Cookies';
import { useLikeToggle } from '../user/hooks/useLikeToggle';

const RelatedProducts = ({ saleId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [token, setToken] = useState(null);
  const pageSize = 5;
  const navigate = useNavigate();
  const { toggleLike } = useLikeToggle(token);

  useEffect(() => {
    const jwtToken = getCookie('jwt_token');
    setToken(jwtToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SEARCH_REST_API_URL}/sale/related/${saleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setRelatedProducts(result.data);
      } catch (error) {
        console.error('관련상품 조회 실패:', error);
      }
    };

    fetchRelatedProducts();
  }, [saleId, token]);

  const handleLike = (saleId) => {
    const target = relatedProducts.find(product => product.saleId === saleId);
    toggleLike(saleId, target?.like, () => {
      setRelatedProducts(prev =>
        prev.map(product =>
          product.saleId === saleId ? { ...product, like: !product.like } : product
        )
      );
    });
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    const maxPage = Math.floor((relatedProducts.length - 1) / pageSize);
    setCurrentPage((prev) => Math.min(prev + 1, maxPage));
  };

  const maxPage = Math.floor((relatedProducts.length - 1) / pageSize);
  const isPrevDisabled = currentPage === 0;
  const isNextDisabled = currentPage === maxPage;

  const visibleProducts = relatedProducts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <section className="related-products w-full mt-12">
      <h3 className="text-2xl font-bold mb-6">관련 상품</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={isPrevDisabled}
          className={`p-2 text-2xl ${isPrevDisabled ? 'text-gray-400' : 'text-black'} cursor-pointer`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="grid grid-cols-5 gap-6 w-full">
          {visibleProducts.map((product) => (
            <div
              key={product.saleId}
              onClick={() => navigate(`/sale/${product.saleId}`)}
              className="border rounded-lg p-4 shadow hover:shadow-lg hover:scale-105 transition transform cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.saleTitle}
                className="w-full h-40 object-contain bg-white rounded mb-2"
              />
              <div className="flex items-center justify-between font-bold mb-2">
                <span className="truncate">{product.saleTitle}</span>
                {product.like ? (
                  <FavoriteIcon
                    onClick={(e) => { e.stopPropagation(); handleLike(product.saleId); }}
                    className="text-red-500 ml-2 cursor-pointer"
                    fontSize="small"
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={(e) => { e.stopPropagation(); handleLike(product.saleId); }}
                    className="text-gray-400 ml-2 cursor-pointer"
                    fontSize="small"
                  />
                )}
              </div>
              <div className="text-green-600 font-bold mb-2">
                {product.price.toLocaleString()}원
              </div>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <StarIcon fontSize="small" className="text-yellow-400" />
                <span className="ml-1">
                  {product.score !== null ? product.score.toFixed(1) : '0.0'}
                </span>
                <span className="ml-2 text-gray-500">리뷰 {product.reviewCount ?? 0}개</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`p-2 text-2xl ${isNextDisabled ? 'text-gray-400' : 'text-black'} cursor-pointer`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default RelatedProducts;