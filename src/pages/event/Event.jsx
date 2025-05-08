import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../common/utils/axiosInstance';
import Loading from '../../common/components/Loading';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_ACTIVITY_REST_API_URL}/user/popup?sortType=EVENT`);
        
        if (response.data && response.data.data) {
          setEvents(response.data.data.contents || []);
        } else {
          setError('데이터 형식이 올바르지 않습니다.');
        }
      } catch (err) {
        setError('이벤트를 불러오는 중 오류가 발생했습니다.');
        console.error('이벤트 목록 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  // 현재 진행중인 이벤트와 종료된 이벤트 분류
  const currentDate = new Date();
  const activeEvents = events.filter(event => new Date(event.endDate) > currentDate);
  const endedEvents = events.filter(event => new Date(event.endDate) <= currentDate);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">이벤트</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 진행중인 이벤트 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">진행중인 이벤트</h2>
        
        {activeEvents.length === 0 ? (
          <p className="text-center text-gray-500 py-10">현재 진행중인 이벤트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeEvents.map(event => (
              <Link 
                to={`/event/${event.id}`} 
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 종료된 이벤트 */}
      {endedEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">종료된 이벤트</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {endedEvents.map(event => (
              <Link 
                to={`/event/${event.id}`} 
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 opacity-70"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    className="grayscale"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">종료된 이벤트</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 truncate">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EventListPage;