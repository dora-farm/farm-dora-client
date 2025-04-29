import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductSummary = ({ saleId, setContent }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [options, setOptions] = useState([]);
  const [origin, setOrigin] = useState('');
  const [title, setTitle] = useState('');
  const [like, setLike] = useState(false);

  const selectedOptionData = options.find(option => option.optionId === Number(selectedOption));
  const selectedOptionPrice = selectedOptionData ? selectedOptionData.price : 0;
  const totalPrice = selectedOptionPrice * quantity;
  const minPrice = options.length > 0 ? Math.min(...options.map(option => option.price)) : 0;
  const displayPrice = selectedOptionData ? selectedOptionPrice : minPrice;

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SEARCH_REST_API_URL}/sale/${saleId}`);
        const { files, options, origin, title, content, like } = response.data.data;
        setImages(files);
        setMainImage(files[0] || '');
        setOptions(options.map(opt => ({
          optionId: opt.optionId,
          optionName: opt.optionName,
          price: opt.price,
        })));
        setOrigin(origin);
        setTitle(title);
        setContent(content);
        setLike(like);
      } catch (error) {
        console.error('상품 상세 조회 실패:', error);
      }
    };

    fetchProductDetail();
  }, []);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleOptionChange = (e) => {
    setSelectedOption(Number(e.target.value));
  };

  const handleAddToCart = async () => {
    if (!selectedOption) {
      alert('옵션을 선택해주세요.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionId: selectedOption,
          quantity: quantity,
        }),
      });

      if (response.status === 409) {
        alert('이미 장바구니에 존재합니다.');
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        alert(result.message);

        throw new Error('장바구니 추가 실패');
      }

      alert('장바구니에 상품이 추가되었습니다.');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
    }
  };
  
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!selectedOption) {
      alert('옵션을 선택해주세요.');
      return;
    }
    navigate('/order', {
      state: {
        optionId: selectedOption,
        quantity: quantity,
      },
    });
  };

  const handleLike = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/like/${saleId}`);

      if (response.status === 200) {
        const isCurrentlyLiked = like;
        setLike(!isCurrentlyLiked);

        if (isCurrentlyLiked) {
          alert('찜 취소에 성공했습니다.');
        } else {
          alert('찜 등록에 성공했습니다.');
        }
      } else {
        alert('찜 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜 등록 실패:', error);
      alert('찜 등록에 실패했습니다.');
    }
  };

  return (
    <section className="p-8 flex gap-12 bg-white rounded-lg shadow-md">
      {/* 왼쪽 : 상품 이미지 */}
      <div className="flex-[0_0_400px]">
        {images.length > 0 && (
          <img
            src={mainImage}
            alt="상품 이미지"
            className="w-full h-[400px] object-contain rounded-lg shadow overflow-hidden bg-white"
          />
        )}
        <div className="flex gap-2 mt-4">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="썸네일"
              onClick={() => setMainImage(img)}
              className="w-20 h-20 object-contain bg-white border rounded-lg cursor-pointer hover:opacity-80 overflow-hidden"
            />
          ))}
        </div>
      </div>

      {/* 오른쪽 : 상품 정보 */}
      <div className="flex-1 flex flex-col gap-6">
        {/* 상품명 */}
        <h2 className="text-2xl font-bold border-b pb-2 mt-4">{title || '제목이 존재하지 않습니다'}</h2>

        {/* 판매가격 */}
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">판매가격</span>
          <span className="text-2xl font-bold text-gray-800">{displayPrice}원</span>
        </div>

        {/* 원산지 */}
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">원산지</span>
          <span className="text-gray-600">{origin}</span>
        </div>

        {/* 옵션 선택 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="option" className="font-medium">옵션</label>
          <div className="relative">
            <select
              id="option"
              value={selectedOption}
              onChange={handleOptionChange}
              className="border p-2 pr-10 rounded appearance-none w-full"
            >
              <option value="">옵션 선택</option>
              {options.map((option) => (
                <option key={option.optionId} value={option.optionId}>
                  {option.optionName} ({option.price}원)
                </option>
              ))}
            </select>
            <ArrowDropDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>
        </div>

        {/* 수량 조절 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (!selectedOption) {
                alert('옵션을 선택해주세요.');
                return;
              }
              setQuantity(prev => Math.max(prev - 1, 1));
            }}
            className="border px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <span className="text-lg">{quantity}</span>
          <button
            onClick={() => {
              if (!selectedOption) {
                alert('옵션을 선택해주세요.');
                return;
              }
              setQuantity(prev => prev + 1);
            }}
            className="border px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>

        {/* 총 상품 금액 */}
        <div className="flex justify-between items-center text-2xl font-bold mt-6 border-t pt-4">
          <span>총 상품 금액</span>
          <span>{totalPrice}원</span>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleLike}
            className={like
              ? 'flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded font-semibold transition-colors'
              : 'flex-1 border border-gray-400 py-3 rounded font-semibold hover:bg-gray-100 transition-colors'
            }
          >
            {like ? (
              <div className="flex items-center justify-center gap-2">
                <FavoriteIcon className="text-white" />
                <span>찜 취소</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FavoriteBorderIcon className="text-gray-500" />
                <span>찜하기</span>
              </div>
            )}
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 border border-gray-400 py-3 rounded font-semibold hover:bg-gray-100 transition-colors"
          >
            장바구니 🛒
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold transition-colors"
          >
            바로 구매
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSummary;