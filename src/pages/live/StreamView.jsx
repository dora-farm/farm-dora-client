import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../common/components/Loading';
import ProductSlider from './ProductSlider';
import NCPlayer from './NCPlayer';

const StreamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [videoLoading, setVideoLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(false); // 처음에는 비활성
  
  // 최종 로딩 상태 계산
  const isLoading = videoLoading || salesLoading;

  const videoPlaylist = [
    {
      file: video.streamUrl,
      poster: video.thumbnailImage,
    }
  ];

  // 첫 번째 useEffect에서는 videoLoading만 관리
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/main/detail/${id}`);

        if (response.data && response.data.data) {
          setVideo(response.data.data);
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('동영상 상세 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('동영상 상세 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  // video 상태가 변경될 때 실행되는 useEffect
  useEffect(() => {
    // video가 존재하고 sellerId가 있는 경우에만 판매자 상품 정보 가져오기
    if (video && video.sellerId) {
      const fetchSales = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/my/seller/item/video/${video.sellerId}`);
          console.log(response);
          if (response.data && response.data.data) {
            setProducts(response.data.data);
          } else {
            setError('판매자 상품 데이터를 불러올 수 없습니다.');
          }
        } catch (err) {
          setError('판매자 정보 오류가 발생했습니다.');
          console.error('판매자 정보 조회 오류:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchSales();
    }
  }, [video]); // video 상태가 변경될 때마다 실행

  const handleGoBack = () => {
    navigate('/live');
  };

  if (loading) return <Loading />;

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || '동영상 정보를 찾을 수 없습니다.'}
        </div>
        <button
          onClick={handleGoBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          동영상 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
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

      </div>

      {/* 제목 */}
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>

      {/* 설명 */}
      <div className="mb-6 text-gray-600">
        <span className="font-semibold">설명: </span>
        {video.desc}
      </div>

      {/* 방송 플레이어 */}
      <div className="video-container">
      <NCPlayer 
        playerId="video-player" 
        playlist={videoPlaylist} 
        autostart={true}
        width="100%"
        height="360px"
      />
    </div>


      {/* 관련 이벤트 링크 (실제 구현 시 관련 이벤트를 불러와 표시) */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">판매상품도 확인해보세요</h2>
        <ProductSlider products={products} />
        <div className="flex justify-center">
          <Link
            to="/live"
            className="text-green hover:text-green-dark font-semibold flex items-center"
          >
            판매 동영상 보기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StreamView;