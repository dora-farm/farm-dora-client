import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Rating from '@mui/material/Rating';

// orderId와 orderData를 props로 받도록 수정
const ReviewModal = ({ isOpen, onClose, orderId, orderData, onReviewComplete }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const ratingMessages = {
    1: '별로였어요',
    2: '아쉬웠어요',
    3: '보통이었어요',
    4: '좋았어요!',
    5: '아주 만족해요!',
  };
  
  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setContent('');
      setSelectedImages([]);
      setImagePreview([]);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // 최대 3개 이미지로 제한
    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return;
    }
    
    // 선택한 파일을 imagePreview에 추가
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);
    setSelectedImages([...selectedImages, ...files]);
  };
  
  const handleRemoveImage = (index) => {
    const newPreviews = [...imagePreview];
    const newSelectedImages = [...selectedImages];
    
    // 이미지 URL 해제 (메모리 누수 방지)
    URL.revokeObjectURL(imagePreview[index]);
    
    newPreviews.splice(index, 1);
    newSelectedImages.splice(index, 1);
    
    setImagePreview(newPreviews);
    setSelectedImages(newSelectedImages);
  };
  
  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 200) {
      setContent(text);
    }
  };
  
  const handleSubmit = async () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    
    if (content.trim() === '') {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }
    
    setSubmitting(true);
    try {
      // FormData를 사용하여 이미지와 함께 전송
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('score', rating);
      formData.append('content', content);
      
      // 백엔드에서 images 배열로 받음
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });
      
      const response = await fetch('http://localhost:8080/api/my/user/order/review', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('리뷰 등록에 실패했습니다.');
      }
      
      // 리뷰 작성 성공 시 콜백 호출 (전달된 경우)
      if (onReviewComplete) {
        onReviewComplete(orderId);
      }
      
      // 추후 모달 처리 예정
      alert('리뷰가 성공적으로 등록되었습니다.');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('리뷰 등록 오류:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }



  };
  
  // 이미지 URL이 있으면 사용, 없으면 기본 이미지 경로 구성
  const productImage = orderData?.saveFile 
    ? `/images/${orderData.saveFile}`
    : 'https://via.placeholder.com/100';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-medium">리뷰 작성</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {/* 상품 정보 */}
        <div className="p-4 border-b">
          <div className="flex">
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-3">
              <img src={productImage} alt={orderData?.title || '상품 이미지'} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium">{orderData?.title || '상품명'}</p>
              <p className="text-sm text-gray-500">
                {orderData?.options && orderData.options.map((option, idx) => (
                  <span key={idx}>{option.name} {option.quantity}개{idx < orderData.options.length - 1 ? ', ' : ''}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
        
        {/* 별점 */}
        <div className="p-4 border-b">
          <div className="mb-1">별점</div>
          <div className="flex">
            <Rating
              name="review-rating"
              value={rating}
              onChange={handleRatingChange}
              size="large"
              precision={1}
              sx={{ 
                color: '#1CA673', // 초록색 별점
                '& .MuiRating-iconEmpty': {
                  color: '#E5E7EB' // 빈 별 색상
                } 
              }}
            />
            <span className="ml-2 text-gray-500">
                {rating > 0 ? ratingMessages[rating] || `${rating}점` : '별점을 선택해주세요'}
            </span>
          </div>
        </div>
        
        {/* 사진 업로드 */}
        <div className="p-4 border-b">
          <div className="mb-2">사진 업로드 <span className="text-gray-500 text-sm">(선택)</span></div>
          <div className="text-xs text-gray-500 mb-2">
            상품과 관련 없거나 부적합한 사진을 리뷰에 등록하시는 경우,
            사진검고 없이 사진이 삭제될 수 있습니다.
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 이미지 업로드 버튼 */}
            <label className="w-16 h-16 border border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer">
              <span className="text-2xl text-gray-400">+</span>
              <span className="text-xs text-gray-400">사진 업로드</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            
            {/* 이미지 미리보기 */}
            {imagePreview.map((src, index) => (
              <div key={index} className="w-16 h-16 border border-gray-300 rounded overflow-hidden relative">
                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs"
                >
                  <X size={16}/>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* 리뷰 내용 */}
        <div className="p-4">
          <div className="mb-2 flex justify-between items-center">
            <div>리뷰를 작성해주세요.</div>
            <div className="text-sm text-gray-500">
              <span className={content.length > 180 ? "text-red-500" : ""}>{content.length}/200자</span>
            </div>
          </div>
          <div className="relative">
            <textarea
              className="w-full border border-gray-300 rounded p-3 h-32 resize-none"
              placeholder="상품을 드시면서 느낀점 장점이나 단점을 솔직하게 알려주세요."
              value={content}
              onChange={handleContentChange}
            ></textarea>
          </div>
        </div>
        
        {/* 등록 버튼 */}
        <button
          className={`w-full py-3 ${submitting ? 'bg-gray-400' : 'bg-green'} text-white font-medium`}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '등록 중...' : '작성하기'}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;