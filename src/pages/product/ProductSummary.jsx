import React, { useState, useEffect } from 'react';
import axios from '../../common/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { fetchWithAuth } from '../../common/utils/fetchWithAuth';
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { getCookie } from '../../common/utils/Cookies';
import { useLikeToggle } from '../user/hooks/useLikeToggle';

const ProductSummary = ({ saleId, setContent }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [options, setOptions] = useState([]);
  const [origin, setOrigin] = useState('');
  const [title, setTitle] = useState('');
  const [like, setLike] = useState(false);
  const [token, setToken] = useState(null);
  const { toggleLike } = useLikeToggle(token);

  const navigate = useNavigate();

  const selectedOptionData = options.find(opt => opt.optionId === Number(selectedOption));
  const selectedOptionPrice = selectedOptionData ? selectedOptionData.price : 0;
  const totalPrice = selectedOptionPrice * quantity;
  const minPrice = options.length > 0 ? Math.min(...options.map(o => o.price)) : 0;
  const displayPrice = selectedOptionData ? selectedOptionPrice : minPrice;

  useEffect(() => {
    const jwtToken = getCookie('jwt_token');
    setToken(jwtToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SEARCH_REST_API_URL}/sale/${saleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
  }, [token]);

  const handleOptionChange = (e) => {
    setSelectedOption(Number(e.target.value));
  };

  const saveGuestBasket = () => {
    const existing = JSON.parse(localStorage.getItem("basket") || "[]");

    if (existing.length >= 16) {
      alert("장바구니에는 최대 16개까지 담을 수 있습니다.");
      return false;
    }

    const alreadyExists = existing.some(item => item.optionId === selectedOptionData.optionId);
    if (alreadyExists) {
      alert("이미 장바구니에 존재합니다.");
      return false;
    }

    const newItem = {
      basketId: Date.now(),
      saleId,
      title,
      option: selectedOptionData.optionName,
      quantity,
      price: selectedOptionData.price,
      imageUrl: mainImage || null,
      optionId: selectedOptionData.optionId,
    };

    existing.push(newItem);
    localStorage.setItem("basket", JSON.stringify(existing));
    return true;
  };

  const handleAddToCart = async () => {
    if (!selectedOptionData) {
      alert('옵션을 선택해주세요.');
      return;
    }

    if (!token) {
      const added = saveGuestBasket();
      if (added) alert("장바구니에 추가되었습니다!");
      return;
    }

    if (!token) {
      const added = saveGuestBasket();
      if (added) alert("장바구니에 추가되었습니다!");
      return;
    }

    try {
      
      const response = await fetchWithAuth(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket`, {
        method: 'GET',
      });
      const result = await response.json();
      const currentCount = result?.data?.contents?.length ?? 0;

      if (currentCount >= 16) {
        alert("장바구니에는 최대 16개까지 담을 수 있습니다.");
        return;
      }
    } catch (e) {
      console.warn("장바구니 개수 확인 실패:", e);
    }

    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket`, {
        method: 'POST',
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

  // const handleLike = async () => {
  //   if (!token) {
  //     alert('로그인이 필요한 기능입니다.');
  //     return;
  //   }

  //   if (!selectedOption) {
  //     alert('옵션을 선택해주세요.');
  //     return;
  //   }

  //   try {
  //     const response = await axios.put(
  //       `${import.meta.env.VITE_BUYER_REST_API_URL}/api/like/${saleId}`,
  //       null,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.status === 200) {
  //       setLike(!like);
  //       alert(like ? '찜 취소에 성공했습니다.' : '찜 등록에 성공했습니다.');
  //     } else {
  //       alert('찜 등록에 실패했습니다.');
  //     }
  //   } catch (error) {
  //     console.error('찜 등록 실패:', error);
  //     alert('찜 등록에 실패했습니다.');
  //   }
  // };

  const handleLike = () => {
    toggleLike(saleId, like, () => setLike(!like));
  };

  return (
    <section className="p-8 flex gap-12 bg-white rounded-lg shadow-md">
      {/* 왼쪽 이미지 */}
      <div className="flex-[0_0_400px]">
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg shadow">
          {mainImage ? (
            <img src={mainImage} alt="상품 이미지" onError={() => setMainImage('')} className="w-full h-full object-contain" />
          ) : (
            <ImageNotSupportedIcon style={{ fontSize: 80, color: "#9CA3AF" }} />
          )}
        </div>
        <div className="flex gap-2 mt-4">
          {images.map((img, index) => (
            <div key={index} className="w-20 h-20 bg-white border rounded-lg flex items-center justify-center">
              {img ? (
                <img src={img} alt="썸네일" onClick={() => setMainImage(img)} onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }} className="w-full h-full object-contain cursor-pointer hover:opacity-80" />
              ) : (
                <ImageNotSupportedIcon style={{ fontSize: 40, color: "#9CA3AF" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 정보 */}
      <div className="flex-1 flex flex-col gap-6">
        <h2 className="text-2xl font-bold border-b pb-2 mt-4">{title || '제목이 존재하지 않습니다'}</h2>
        <div className="flex justify-between text-lg">
          <span className="font-semibold">판매가격</span>
          <span className="text-2xl font-bold text-gray-800">{displayPrice}원</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-semibold">원산지</span>
          <span className="text-gray-600">{origin}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">옵션</label>
          <div className="relative">
            <select value={selectedOption} onChange={handleOptionChange} className="appearance-none border p-2 pr-10 rounded w-full">
              <option value="">옵션 선택</option>
              {options.map((opt) => (
                <option key={opt.optionId} value={opt.optionId}>
                  {opt.optionName} ({opt.price}원)
                </option>
              ))}
            </select>
            <ArrowDropDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => selectedOption && setQuantity(q => Math.max(q - 1, 1))} className="border px-3 py-1 rounded hover:bg-gray-100">-</button>
          <span className="text-lg">{quantity}</span>
          <button onClick={() => selectedOption && setQuantity(q => q + 1)} className="border px-3 py-1 rounded hover:bg-gray-100">+</button>
        </div>

        <div className="flex justify-between text-2xl font-bold mt-6 border-t pt-4">
          <span>총 상품 금액</span>
          <span>{totalPrice}원</span>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={handleLike} className={like ? 'flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded font-semibold' : 'flex-1 border border-gray-400 py-3 rounded font-semibold hover:bg-gray-100'}>
            {like ? (
              <div className="flex justify-center items-center gap-2">
                <FavoriteIcon className="text-white" /><span>찜 취소</span>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <FavoriteBorderIcon className="text-gray-500" /><span>찜하기</span>
              </div>
            )}
          </button>
          <button onClick={handleAddToCart} className="flex-1 border border-gray-400 py-3 rounded font-semibold hover:bg-gray-100">
            장바구니 🛒
          </button>
          <button onClick={handleBuyNow} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded font-semibold">
            바로 구매
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSummary;