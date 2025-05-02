import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../common/components/Loading';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        // 이벤트 상세 정보를 가져오는 API 엔드포인트
        const response = await axios.get(`${import.meta.env.VITE_ACTIVITY_REST_API_URL}/api/popup/${id}`);
        
        if (response.data && response.data.data) {
          setEvent(response.data.data);
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('이벤트 상세 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('이벤트 상세 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\./g, '-').replace(/ /g, ' ');
  };

  const handleGoBack = () => {
    navigate('/event');
  };

  if (loading) return <Loading />;

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || '이벤트 정보를 찾을 수 없습니다.'}
        </div>
        <button 
          onClick={handleGoBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          이벤트 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const isEventEnded = new Date(event.endDate) < new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 이벤트 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={handleGoBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          목록으로
        </button>
        
        {isEventEnded && (
          <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium">
            종료된 이벤트
          </div>
        )}
      </div>
      
      {/* 이벤트 제목 */}
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      
      {/* 이벤트 기간 */}
      <div className="mb-6 text-gray-600">
        <span className="font-semibold">이벤트 기간: </span>
        {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
      </div>
      
      {/* 이벤트 이미지 */}
      <div className={`rounded-lg overflow-hidden mb-8 relative ${isEventEnded ? 'grayscale opacity-70' : ''}`} style={{ height: '800px' }}>
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center'
          }}
        />
      </div>
      
      {/* 관련 이벤트 링크 (실제 구현 시 관련 이벤트를 불러와 표시) */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">다른 이벤트도 확인해보세요</h2>
        <div className="flex justify-center">
          <Link 
            to="/event" 
            className="text-green hover:text-green-dark font-semibold flex items-center"
          >
            모든 이벤트 보기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;