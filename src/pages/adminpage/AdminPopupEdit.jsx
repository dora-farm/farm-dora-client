import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPopupEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popupTypes, setPopupTypes] = useState([]);
  
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    typeId: '',
    title: '',
    startDate: '',
    endDate: '',
  });
  
  // 파일 상태 관리
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  // 팝업 타입 목록과 상세 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 팝업 타입 목록 가져오기
        const typesResponse = await axios.get('http://localhost:8080/api/popup/types');
        if (typesResponse.data && typesResponse.data.data) {
          setPopupTypes(typesResponse.data.data);
        }
        
        // 팝업 상세 정보 가져오기
        const popupResponse = await axios.get(`http://localhost:8080/api/popup/${id}`);
        if (popupResponse.data && popupResponse.data.data) {
          const popupData = popupResponse.data.data;
          
          // ISO 날짜 형식으로 변환
          const formatDateForInput = (dateString) => {
            if (!dateString) return '';
            
            // 이미 ISO 형식이면 그대로 반환
            if (dateString.includes('T')) {
              return dateString.substring(0, 16); // YYYY-MM-DDTHH:MM 형식
            }
            
            // 다른 형식이면 변환 후 반환
            const date = new Date(dateString);
            return date.toISOString().substring(0, 16); // YYYY-MM-DDTHH:MM 형식
          };
          
          setFormData({
            typeId: popupData.type.typeId,
            title: popupData.title,
            startDate: formatDateForInput(popupData.startDate),
            endDate: formatDateForInput(popupData.endDate),
          });
          
          setFilePreview(popupData.imageUrl);
        } else {
          console.error('팝업/배너 상세 정보 형식이 예상과 다릅니다:', popupResponse.data);
          alert('팝업/배너 정보를 불러올 수 없습니다.');
          navigate('/admin/popup');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('팝업/배너 정보를 불러오는 중 오류가 발생했습니다:', error);
        alert('팝업/배너 정보를 불러올 수 없습니다.');
        navigate('/admin/popup');
      }
    };
    
    fetchData();
  }, [id, navigate]);
  
  // 입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // 이미지 파일 선택 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };
  
  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.typeId || !formData.title || !formData.startDate || !formData.endDate) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      
      // FormData 객체 생성 (파일 업로드를 위함)
      const submitData = new FormData();
      submitData.append('typeId', formData.typeId);
      submitData.append('title', formData.title);
      submitData.append('startDate', formData.startDate);
      submitData.append('endDate', formData.endDate);
      
      // 파일이 선택된 경우에만 추가
      if (file) {
        submitData.append('file', file);
      }
      
      // API 호출
      await axios.put(`http://localhost:8080/api/popup/edit/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('팝업/배너가 성공적으로 수정되었습니다.');
      navigate(`/admin/popup/${id}`); // 상세 페이지로 이동
      
    } catch (error) {
      console.error('팝업/배너 수정 중 오류가 발생했습니다:', error);
      alert('팝업/배너 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  // 취소 버튼 처리
  const handleCancel = () => {
    navigate(`/admin/popup/${id}`); // 상세 페이지로 이동
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 pb-2 border-b">이벤트/배너 수정</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 팝업 타입 선택 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">타입</label>
            <select
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">타입을 선택하세요</option>
              {Array.isArray(popupTypes) && popupTypes.map((type) => (
                <option key={type.typeId} value={type.typeId}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 제목 입력 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="제목을 입력하세요"
              maxLength={50}
              required
            />
          </div>
          
          {/* 기간 설정 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">조회 기간</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <span className="mx-2 text-gray-500">-</span>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* 이미지 업로드 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">상세 이미지</label>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mb-4"
              />
              <p className="text-sm text-gray-500 mb-2">
                새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
              </p>
              {filePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">이미지 미리보기:</p>
                  <div className="w-full h-64 border rounded-md overflow-hidden bg-white">
                    <img
                      src={filePreview}
                      alt="이미지 미리보기"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 버튼 영역 */}
          <div className="flex justify-center space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  처리중...
                </span>
              ) : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPopupEdit;