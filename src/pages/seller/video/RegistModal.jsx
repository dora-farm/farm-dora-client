import React, { useState} from 'react';

const RegistModal = ({ isOpen, onClose, loading, refreshProducts}) => {
  const [title, setTitle] = useState('');
  const [desc, setDescription] = useState('');
  const [video, setVideo] = useState(null);

  const handleSubmit = async () => {
    try {
      // FormData 객체 생성
      const formData = new FormData();
      
      // 파일 추가
      formData.append('video', video);
      
      // 다른 필드 추가
      formData.append('title', title);
      formData.append('desc', desc);
      
      const response = await fetch(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/register`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.status === 200) {
        console.log('성공:', data);
        refreshProducts();
        onClose();
      } else {
        console.error('서버 오류:', data.message || '예기치 못한 오류');
        alert(`오류 발생: ${data.message || '처리에 실패했습니다.'}`);
      }
    } catch (error) {
      console.error('통신 오류:', error);
      alert('네트워크 오류 또는 서버와의 연결 실패');
    }
  };

  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">동영상 등록</h2>
        
        {/* 상품 제목 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="동영상 제목을 입력하세요"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="설명을 입력하세요"
          />
        </div>
        
        {/* 비디오 업로드 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            업로드
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '처리 중...' : '확인'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistModal;