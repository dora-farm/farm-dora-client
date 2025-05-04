import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from '../../../common/utils/axiosInstance';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import ReviewList from './components/ReviewList';
import Pagination from '../../../common/components/Pagination';
import ReviewDetailModal from './components/ReviewDetailModal';

function Review() {
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [searchParams, setSearchParams] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewDetail, setReviewDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  

  const handleSearch = async (params) => {
    try {
      setLoading(true);

      const searchParams = {
        ...params,
        page: 0,
        size: itemsPerPage
      };

      setSearchParams(searchParams);
      setCurrentPage(0);

      const response = await axios.get(
        `${import.meta.env.VITE_SEARCH_REST_API_URL}/my/seller/order/review`,
        { 
          params: {
            ...searchParams
          }
        }
      );

      if (response.status === 200) {
        const responseData = response.data.data;

        setReviews(responseData.contents || []);

        setTotalPages(responseData.totalPages || 1);
        setTotalElements(responseData.totalElements || 0);
        setHasNext(responseData.hasNext || false);
        setHasPrev(responseData.hasPrevious || false);
      } else {
        throw new Error(response.data?.message || '주문 정보를 가져오는데 실패했습니다.');
      }
      
    } catch (error) {
      console.log("리뷰 목록을 호출할 수 없습니다", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const startDate = `${oneMonthAgo.toLocaleDateString('en-CA')}T00:00:00`;
  const endDate = `${today.toLocaleDateString('en-CA')}T23:59:59`;

  const initialParams = useMemo(() => ({
    searchType: "PRODUCT",
    startDate: startDate,
    endDate: endDate,
    statusIds: [],
    searchPeriod: "ONE_MONTH",
    sort: "LATEST",
    keyword: "",
    page: 0,          // 페이지 번호 추가
    size: itemsPerPage, // 페이지 크기 설정
  }), [startDate, endDate, itemsPerPage]);
  
  const loadReviewDetail = async (reviewId) => {
    if (!reviewId) return;

    try {
      setDetailLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_ACTIVITY_REST_API_URL}/api/my/seller/order/review`, 
        { params: { reviewId } }
      );

      if (response.status === 200) {
        setReviewDetail(response.data.data);
        setModalOpen(true);
      } else {
        throw new Error(response.data?.message || '주문 상세 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.log("주문 상세정보를 불러올 수 없습니다.", error.message);
      setError(error.message);
    } finally {
      setDetailLoading(false);
    }
  };
  
  useEffect(() => {
    setSearchParams(initialParams);
    handleSearch(initialParams);
  }, []);
  
  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    
    // 페이지 변경 시 API 재호출
    const pageParams = {
      ...searchParams,
      page: newPage,
      size: itemsPerPage
    };
    
    // 페이지 데이터 요청
    (async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `${import.meta.env.VITE_SEARCH_REST_API_URL}/my/seller/order/review`,
          { 
            params: {
              ...pageParams,
              sellerId: 1,
            }
          }
        );
        
        if (response.status === 200) {
          const responseData = response.data.data;
          
          // 응답에서 주문 데이터와 페이지네이션 정보 업데이트
          setReviews(responseData.contents || []);
          setTotalPages(responseData.totalPages || 1);
          setTotalElements(responseData.totalElements || 0);
          setHasPrev(responseData.hasPrevious || false);
          setHasNext(responseData.hasNext || false);
        } else {
          throw new Error(response.data?.message || '주문 정보를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error("페이지 데이터를 가져올 수 없습니다.", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, itemsPerPage]);

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    loadReviewDetail(review.reviewId);
  }

  return (
    <div className="space-y-6">
      <Container>
        <SearchForm
          onSearch={handleSearch}
          initialValues={searchParams}
        />
      </Container>
      
      <Container>        
        <ReviewList 
          reviews={reviews}
          loading={loading}
          error={error}
          onReviewClick={handleReviewClick}
        />
      </Container>
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          pageButtonCount={5}
          onPageChange={handlePageChange}
          activeColor="bg-brown"
          hoverColor="hover:bg-gray-100"
        />
      )}
      <ReviewDetailModal 
        detail={reviewDetail}
        review={selectedReview}
        loading={detailLoading}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setReviewDetail(null);
        }}
      />
    </div>
  )
}

export default Review;