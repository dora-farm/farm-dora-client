import React, { useState, useEffect } from 'react';
import HomeVideoSlider from './HomeVideoSlider';
import BannerSlider from './BannerSlider';
import Loading from '../common/components/Loading';
import axios from '../common/utils/axiosInstance';
import Pagination from '../common/components/Pagination';
import ProductCard from '../common/components/ProductCard';
import { TrendingUp, VideoLibrary } from '@mui/icons-material';
import {useLocation} from "react-router-dom";
import AlertModal2 from "@/common/components/modal/AlertModal2.jsx";

function Home() {
  const [banners, setBanners] = useState([]);
  const [videos, setVideos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingPage, setRankingPage] = useState(0);
  const [rankingTotalPages, setRankingTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const successMessage = params.get("success");
    if (successMessage === "oauthregister") {
      setModalTitle("성공");
      setModalMessage("간편 로그인 연동 되었습니다.");
      setShowModal(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchVideosAndRanking = async () => {
      try {
        setLoading(true);
        const [videoRes, rankingRes, bannerRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/main/home`),
          axios.get(`${import.meta.env.VITE_SEARCH_REST_API_URL}/sale/rank?page=${rankingPage}`),
          axios.get(`${import.meta.env.VITE_BUYER_REST_API_URL}/popup`)
        ]);

        if (bannerRes.data?.data) {
          setBanners(bannerRes.data.data);
        }

        if (videoRes.data?.data?.contents) {
          setVideos(videoRes.data.data.contents);
        }

        const rankData = rankingRes.data?.data;
        if (rankData) {
          const enriched = rankData.contents.map(item => ({
            ...item,
            liked: item.liked ?? false
          }));
          setRanking(enriched);
          setRankingPage(rankData.currentPage);
          setRankingTotalPages(Math.min(rankData.totalPages, 5));
          setHasNext(rankData.hasNext);
          setHasPrevious(rankData.hasPrevious);
        }

      } catch (err) {
        console.error('데이터 불러오기 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideosAndRanking();
  }, [rankingPage]);

  const handleToggleLike = async (saleId) => {
    try {
      const index = ranking.findIndex((item) => item.saleId === saleId);
      if (index === -1) return;

      const isLiked = ranking[index].liked;
      const url = `${import.meta.env.VITE_BUYER_REST_API_URL}/like/${saleId}`;

      await axios.put(url, null);

      const updated = [...ranking];
      updated[index] = { ...updated[index], liked: !isLiked };
      setRanking(updated);

      if (isLiked) {
        alert('찜 해제에 성공했습니다.');
      } else {
        alert('찜 등록에 성공했습니다.');
      }
    } catch (err) {
      console.error('찜 요청 실패:', err);
      alert('찜 요청에 실패했습니다.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="px-4 md:px-10 py-10 bg-gray-50 min-h-screen">
      {/*  배너 슬라이더 */}
      <BannerSlider banners={banners} />

      {/*  실시간 랭킹 */}
      <section className="mb-16">
        <div className="flex items-center mb-6">
          <TrendingUp className="text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">실시간 랭킹</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {ranking.map((item) => (
              <ProductCard
                key={item.saleId}
                saleId={item.saleId}
                title={item.title}
                mainImage={item.imageUrl}
                minPrice={item.minPrice}
                liked={item.liked}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>

          {rankingTotalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={rankingPage}
                totalPages={rankingTotalPages}
                onPageChange={setRankingPage}
                hasPrev={hasPrevious}
                hasNext={hasNext}
                pageButtonCount={5}
                activeColor="bg-green"
                hoverColor="hover:bg-gray-100"
              />
            </div>
          )}
        </div>
      </section>

      {/* 최신 동영상 */}
      <section>
        <div className="flex items-center mb-6">
          <VideoLibrary className="text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">최신 동영상</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <HomeVideoSlider videos={videos} />
        </div>
      </section>
      {showModal && (
          <AlertModal2
              title={modalTitle}
              message={modalMessage}
              onClose={() => setShowModal(false)}
          />
      )}
    </div>
  );
}

export default Home;