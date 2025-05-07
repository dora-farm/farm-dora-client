import axios from 'axios';

export const useLikeToggle = (token) => {
  const toggleLike = async (saleId, isLiked, onSuccess) => {
    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BUYER_REST_API_URL}/like/${saleId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onSuccess();
        alert(isLiked ? '찜 취소에 성공했습니다.' : '찜 등록에 성공했습니다.');
      } else {
        alert('찜 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜 등록 실패:', error);
      alert('찜 등록에 실패했습니다.');
    }
  };

  return { toggleLike };
};