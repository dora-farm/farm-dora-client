import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../common/utils/axiosInstance';
import AlertModal from '../../common/components/modal/AlertModal'; // 경로는 실제 프로젝트 구조에 맞게 조정해주세요

const AdminPopupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  
  // 알림 모달 상태
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null
  });
  
  // 이벤트/배너 상세 정보 조회
  useEffect(() => {
    const fetchPopupDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_ACTIVITY_REST_API_URL}/api/popup/${id}`);
        
        if (response.data && response.data.data) {
          setPopup(response.data.data);
        } else {
          console.error('이벤트/배너 상세 정보 형식이 예상과 다릅니다:', response.data);
          setModal({
            show: true,
            title: '데이터 로드 실패',
            message: '이벤트/배너 정보를 불러올 수 없습니다.',
            onConfirm: () => navigate('/admin/popup')
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('이벤트/배너 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
        setModal({
          show: true,
          title: '데이터 로드 실패',
          message: '이벤트/배너 정보를 불러올 수 없습니다.',
          onConfirm: () => navigate('/admin/popup')
        });
        setLoading(false);
      }
    };
    
    fetchPopupDetail();
  }, [id, navigate]);
  
  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };
  
  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/admin/popup/edit/${id}`);
  };
  
  // 삭제 확인 모달 표시
  const handleDeleteClick = () => {
    setModal({
      show: true,
      title: '이벤트/배너 삭제',
      message: `"${popup.title}" 이벤트/배너를 삭제하시겠습니까?`,
      type: 'confirm',
      onConfirm: handleConfirmDelete
    });
  };
  
  // 삭제 확정
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/popup/${id}`);
      setModal({
        show: true,
        title: '삭제 성공',
        message: '이벤트/배너가 성공적으로 삭제되었습니다.',
        onConfirm: () => navigate('/admin/popup')
      });
    } catch (error) {
      console.error('이벤트/배너 삭제 중 오류가 발생했습니다:', error);
      setModal({
        show: true,
        title: '삭제 실패',
        message: '이벤트/배너 삭제 중 오류가 발생했습니다.',
      });
    }
  };
  
  // 목록으로 돌아가기
  const handleBackToList = () => {
    navigate('/admin/popup');
  };
  
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!popup) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-lg text-gray-600 mb-4">이벤트/배너 정보를 찾을 수 없습니다.</p>
          <button
            onClick={handleBackToList}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 pb-2 border-b">이벤트/배너 상세</h1>
        
        <div className="space-y-6">
          {/* 타입 및 제목 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray-600 font-medium mb-2">타입</h3>
              <div className="p-3 bg-gray-50 rounded-md border">{popup.type.name}</div>
            </div>
            
            {/* 생성일 */}
            <div>
                <h3 className="text-gray-600 font-medium mb-2">등록일</h3>
                <div className="p-3 bg-gray-50 rounded-md border">
                {formatDate(popup.createdAt)}
                </div>
            </div>
          </div>
          <div>
            <h3 className="text-gray-600 font-medium mb-2">제목</h3>
            <div className="p-3 bg-gray-50 rounded-md border">{popup.title}</div>
          </div>
        
          {/* 기간 */}
          <div>
            <h3 className="text-gray-600 font-medium mb-2">이벤트 기간</h3>
            <div className="p-3 bg-gray rounded-md border">
              {formatDate(popup.startDate)} ~ {formatDate(popup.endDate)}
            </div>
          </div>
          
          {/* 이미지 */}
          <div>
            <h3 className="text-gray-600 font-medium mb-2">이미지</h3>
            <div className="p-3 bg-gray-50 rounded-md border">
              {popup.imageUrl ? (
                <img 
                  src={popup.imageUrl} 
                  alt={popup.title} 
                  className="max-w-full h-auto max-h-96 mx-auto"
                />
              ) : (
                <div className="text-center py-10 text-gray-500">
                  이미지가 없습니다.
                </div>
              )}
            </div>
          </div>
          
          {/* 버튼 영역 */}
          <div className="flex justify-center space-x-4 pt-4 border-t">
            <button
              onClick={handleBackToList}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              목록
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-green text-white rounded-md hover:bg-green-700 transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDeleteClick}
              className="px-6 py-2 bg-danger text-white rounded-md hover:bg-danger-dark transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      
      {/* 알림 모달 */}
      {modal.show && (
        <AlertModal
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={handleCloseModal}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
};

export default AdminPopupDetail;