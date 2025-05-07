import { useState, useEffect } from 'react';
import SearchSection from './components/SearchSection.jsx';
import ReviewTable from './components/ReviewTable';
import Pagination from '../../common/components/Pagination';
import ReviewDetailModal from './modal/ReviewDetailModal';
import Loading from '../../common/components/Loading';
import AlertModal2 from '../../common/components/modal/AlertModal2.jsx';
import { fetchWithAuth } from '../../common/utils/fetchWithAuth.js';

function AdminReview() {
  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('PRODUCT_NAME');
  const [sortFilter, setSortFilter] = useState('LATEST');
  
  // 데이터 상태
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewDetail, setReviewDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 알림 모달
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: ''
  });

  // 페이지네이션 상태
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    pageSize: 10
  });

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setPagination(prevState => ({
      ...prevState,
      currentPage: page
    }));
  };

  // 알림 모달 닫기 핸들러
  const handleCloseModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  // 리뷰 상세 조회 함수
  const fetchReviewDetail = async (reviewId) => {
    setLoading(true);
    setModalOpen(true);
    
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_ACTIVITY_REST_API_URL}/admin/review/${reviewId}`);
      const httpResponse = await response.json();
      setReviewDetail(httpResponse.data);
    } catch (error) {
      console.error('리뷰 상세 조회 오류:', error);
      setModal({
        show: true,
        title: '조회 실패',
        message: '리뷰 상세 조회 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  // 초기 리뷰 데이터 로드
  const fetchInitialReviews = async () => {
    setIsLoading(true);

    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_ACTIVITY_REST_API_URL}/admin/review/allreviews?sortType=${sortFilter}&page=0`);
      
      if (!response.ok) {
        throw new Error('초기 데이터를 불러오는 중 오류가 발생했습니다.');
      }
      
      const httpResponse = await response.json();
      
      // 데이터 안전하게 접근
      const reviewsData = httpResponse.data || {};
      const content = reviewsData.contents || [];
      setReviews(content);
      
      setPagination({
        currentPage: reviewsData.currentPage || 0,
        totalElements: reviewsData.totalElements || 0,
        totalPages: reviewsData.totalPages || 0,
        hasNext: reviewsData.hasNext || false,
        hasPrev: reviewsData.hasPrevious || false,
        pageSize: reviewsData.pageSize || 10
      });
    } catch (error) {
      console.error('초기 리뷰 데이터 로딩 중 오류:', error);
      setModal({
        show: true,
        title: '데이터 로드 실패',
        message: '리뷰 데이터를 불러오는 중 오류가 발생했습니다.'
      });
      setReviews([]); // 오류 시 빈 배열로 설정
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchInitialReviews();
  }, []);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    fetchSearchReviews();
  }, [pagination.currentPage]);

  // 리뷰 검색 함수
  const fetchSearchReviews = async () => {
    setIsLoading(true);

    // 검색 쿼리 파라미터 구성
    let url = `${import.meta.env.VITE_ACTIVITY_REST_API_URL}/admin/review/allreviews?sortType=${sortFilter}&page=${pagination.currentPage}`;
    
    // 검색어가 있는 경우에만 검색 파라미터 추가
    if (searchTerm.trim()) {
      url += `&searchType=${searchType}&keyword=${encodeURIComponent(searchTerm.trim())}`;
    }

    try {
      const response = await fetchWithAuth(url);
      
      if (!response.ok) {
        throw new Error('검색 중 오류가 발생했습니다.');
      }
      
      const httpResponse = await response.json();
      
      // 데이터 안전하게 접근
      const reviewsData = httpResponse.data || {};
      const content = reviewsData.contents || [];
      setReviews(content);
      
      setPagination({
        currentPage: reviewsData.currentPage || 0,
        totalElements: reviewsData.totalElements || 0,
        totalPages: reviewsData.totalPages || 0,
        hasNext: reviewsData.hasNext || false,
        hasPrev: reviewsData.hasPrevious || false,
        pageSize: reviewsData.pageSize || 10
      });
    } catch (error) {
      console.error('리뷰 검색 중 오류:', error);
      setModal({
        show: true,
        title: '검색 실패',
        message: '리뷰 검색 중 오류가 발생했습니다.'
      });
      setReviews([]); // 오류 시 빈 배열로 설정
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 0
    }));
    fetchSearchReviews();
  };

  // 리셋 버튼 클릭 시
  const handleReset = () => {
    setSearchTerm('');
    setSortFilter('LATEST');
    setSearchType('PRODUCT_NAME');
    setPagination(prev => ({
      ...prev,
      currentPage: 0
    }));
    fetchInitialReviews();
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_ACTIVITY_REST_API_URL}/admin/review/${reviewId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setModal({
          show: true,
          title: '삭제 성공',
          message: '리뷰가 성공적으로 삭제되었습니다.'
        });
        setModalOpen(false);
        fetchSearchReviews();
      } else {
        setModal({
          show: true,
          title: '삭제 실패',
          message: '리뷰 삭제에 실패했습니다.'
        });
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류:', error);
      setModal({
        show: true,
        title: '삭제 실패',
        message: '리뷰 삭제 중 오류가 발생했습니다.'
      });
    }
  };

  // 로딩 상태 렌더링
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b">리뷰 관리</h1>
      
      {/* 검색 섹션 컴포넌트 */}
      <SearchSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchType={setSearchType}
        sortFilter={sortFilter}
        setSortFilter={setSortFilter}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
      
      {/* 결과 목록 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <div>리뷰 목록 (총 <span className='text-green'>{pagination.totalElements}</span>개)</div>
        </div>
        
        {/* 리뷰 테이블 컴포넌트 */}
        <ReviewTable 
          reviews={reviews}
          isLoading={isLoading}
          onReviewClick={fetchReviewDetail}
        />

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

      {/* 리뷰 상세 정보 모달 */}
      {modalOpen && (
        <ReviewDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          reviewDetail={reviewDetail}
          loading={loading}
          onDelete={handleDeleteReview}
        />
      )}

      {/* 알림 모달 */}
      {modal.show && (
        <AlertModal2
          title={modal.title}
          message={modal.message}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default AdminReview;