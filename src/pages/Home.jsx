import React, { useState, useEffect } from 'react';
import HomeVideoSlider from "./HomeVideoSlider";
import Loading from '../common/components/Loading';
import axios from 'axios';

function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/main/home`);
        if (response.data && response.data.data) {
          setVideos(response.data.data.contents);
        } else {
          console.lot("동영상 불러오기 에러");
        }
      } catch (err) {
        console.error('동영상 불러오기 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);


  if (loading) return <Loading />;
  return (
    <div>
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">실시간 랭킹</h2>

      </div>

      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">최신 동영상</h2>
              <HomeVideoSlider videos={videos} />
      </div>
    </div>
  )
}

export default Home