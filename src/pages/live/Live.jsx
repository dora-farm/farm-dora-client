import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../common/components/Loading';
import Pagination from '../../common/components/Pagination';

const Live = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    pageSize: 6
  });


  useEffect(() => {
    fetchEvents();
  }, [pagination.currentPage]);  // 빈 의존성 배열 = 마운트 시 1회만 실행

  const fetchEvents = async (page = pagination.currentPage, size = pagination.pageSize) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/main/list?page=${page}&size=${size}`);
      if (response.data && response.data.data) {
        const HttpResponse = response.data.data;
        setVideos(HttpResponse.contents);
        setPagination({
          currentPage: HttpResponse.currentPage,
          totalElements: HttpResponse.totalElements,
          totalPages: HttpResponse.totalPages,
          hasNext: HttpResponse.hasNext,
          hasPrev: HttpResponse.hasPrevious,
          pageSize: HttpResponse.pageSize
        });
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

  // 페이지 변경 핸들러 (POST)
  const handlePageChange = (page) => {
    setPagination(prevState => ({
      ...prevState,  // 이전 상태의 모든 속성을 복사
      currentPage: page // currentPage만 업데이트
    }));
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">동영상</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 진행중인 이벤트 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">바로 지금 판매 중!</h2>

        {videos.length === 0 ? (
          <p className="text-center text-gray-500 py-10">현재 등록 된 동영상이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map(video => (
              <Link
                to={`/live/view/${video.id}`}
                key={video.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={video.thumbnailImage}
                    alt={video.title}
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
                  <h3 className="font-semibold text-lg mb-2 truncate">{video.title}</h3>
                  <p className="text-sm text-gray-600">
                    {video.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        onPageChange={handlePageChange}
        activeColor="bg-green"
        hoverColor="hover:bg-gray"
      />

    </div>
  );
};

export default Live;