// src/pages/seller/Manage.jsx
import { useState, useEffect, useRef } from 'react';

import Keyword from '../../common/components/search/Keyword';
import BasicBtn from '../../common/components/search/BasicBtn';
import Pagination from '../../common/components/Pagination';

//componentes
import AlertModal from '../../common/components/modal/AlertModal';
import Loading from '../../common/components/Loading';
import VideoTable from '../../common/components/product/VideoTable';
//hooks
import { useCheckboxes } from '../../common/hooks/useCheckboxes';
import { fetchWithAuth } from '../../common/utils/fetchWithAuth';

function AdminBroadcast() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [sortFilter, setSortFilter] = useState('LATEST');
  const [isLoading, setIsLoading] = useState(false);
  
  // 검색창 포커스
  const searchInputRef = useRef(null);

  // 검색 트리거 상태 추가
  const [searchTrigger, setSearchTrigger] = useState(0);
  
  // 모달(알림)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    pageSize: 5
  });

  const {
    items: checkedProducts,
    isAllChecked,
    handleAllCheck,
    handleItemCheck,
    getSelectedIds,
    setItems: setCheckboxItems
  } = useCheckboxes([],`id`);

  // 검색 결과가 변경되면 체크박스 상태 업데이트
  useEffect(() => {
    setCheckboxItems(products);
  }, [products, setCheckboxItems]);

  const handleStatusCheck = async (videoId) => {

    try {
 
      // fetch API를 사용하여 서버로 요청 보내기
      const response = await fetchWithAuth(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/updateStatus/${videoId}`, {
        method: 'PUT',
      });
      
      // 응답 처리
      if (response.status === 200) {
        // 성공 후 처리 (Post방식으로 값 다시 불러오기)
        fetchSearchProducts();
      } else {
        setModalMessage('수정 실패: ' + response.statusText);
        setShowModal(true);
      }
    } catch (error) {
      console.error('요청 오류:', error);
      setModalMessage('요청 처리 중 오류가 발생했습니다.');
      setShowModal(true);
    }
  }

  
  // 페이지 변경 핸들러 (POST)
  const handlePageChange = (page) => {
    setPagination(prevState => ({
    ...prevState,  // 이전 상태의 모든 속성을 복사
    currentPage: page // currentPage만 업데이트
  }));
};

// 검색 및 필터링 핸들러
const handleSearch = () => {
  setPagination(prevPagination => ({
    ...prevPagination,
    currentPage: 0
  }));
  // 트리거 상태 업데이트
  setSearchTrigger(prev => prev + 1);
};

// useEffect 수정
useEffect(() => {
  fetchSearchProducts();
}, [pagination.currentPage, searchTrigger]);
  
  // 초기 GET 데이터 로드 함수
  const fetchInitialProducts = async () => {
    setIsLoading(true);

    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/admin/list/${pagination.pageSize}`);
      console.log(response.ok);
      if (!response.ok) {
        throw new Error('초기 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    // 응답 텍스트 확인
    const httpResponse = await response.json();
    console.log('서버 응답:', httpResponse.data); 
      setProducts(httpResponse.data.contents);
      setPagination({
        currentPage: httpResponse.data.currentPage,
        totalElements: httpResponse.data.totalElements,
        totalPages: httpResponse.data.totalPages,
        hasNext: httpResponse.data.hasNext,
        hasPrev: httpResponse.data.hasPrevious,
        pageSize: httpResponse.data.pageSize
      });
    } catch (error) {
      console.error('초기 상품 데이터 로딩 중 오류:', error);
    } finally {
      setIsLoading(false);
          // 초기 로드 후 포커스
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
    }
  }

    //초기 데이터 로드 (GET)
    useEffect(() => {
      fetchInitialProducts();
    }, []);

  // 상품 데이터 및 페이지네이션 POST API 함수
  const fetchSearchProducts = async () => {
    setIsLoading(true);

    // JSON 데이터 준비
    const jsonData = {
      keyword: searchTerm,
      sort: sortFilter,
      page: pagination.currentPage,
      size: pagination.pageSize
    };

    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/admin/search`, {
        method: 'POST',
        body: JSON.stringify(jsonData)
      });

    // 응답 텍스트 확인
    const httpResponse = await response.json();
      console.log('서버 응답:', httpResponse.data);
      setProducts(httpResponse.data.contents);
      setPagination({
        currentPage: httpResponse.data.currentPage,
        totalElements: httpResponse.data.totalElements,
        totalPages: httpResponse.data.totalPages,
        hasNext: httpResponse.data.hasNext,
        hasPrev: httpResponse.data.hasPrevious,
        pageSize: httpResponse.data.pageSize
      });
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
     // 초기화 후 즉시 검색 실행
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
    }
  };

  const deleteSelectedItems = async() => {
    // useCheckboxes의 getSelectedIds 함수 사용
    const selectedProductIds = getSelectedIds();
    
    if (selectedProductIds.length === 0) {
      setModalMessage('삭제할 항목을 선택해주세요.');
      setShowModal(true);
      return;
    }
    
    try {
      // JSON 형태로 가공
      const request = {
        broadcastIds: selectedProductIds
      };
      
      // fetch API를 사용하여 서버로 요청 보내기
      const response = await fetchWithAuth(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/video/delete`, {
        method: 'DELETE',
        body: JSON.stringify(request)
      });
      
      // 응답 처리
      if (response.status === 200) {
        setModalMessage('삭제 성공');
        setShowModal(true);
        // 성공 후 처리 (Post방식으로 값 다시 불러오기)
        fetchSearchProducts();
      } else {
        setModalMessage('삭제 실패: ' + response.statusText);
        setShowModal(true);
      }
    } catch (error) {
      console.error('요청 오류:', error);
      setModalMessage('요청 처리 중 오류가 발생했습니다.');
      setShowModal(true);
    }
  }

  const handleReset = () => {
    setSearchTerm('');
    setSortFilter('LATEST');
  };
  
  // 로딩 상태 렌더링
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b">동영상 조회</h1>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <form onSubmit={(e) => {
          e.preventDefault();
            handleSearch();
          }}>
          {/* 검색창 구현(컴포넌트) */}
          <Keyword 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            sortFilter={sortFilter} 
            setSortFilter={setSortFilter}
            inputRef={searchInputRef}
          />
    
          <BasicBtn 
            handleSearch={handleSearch} 
            handleReset={handleReset}
          />
        </form>
      </div>
      
      {/* 결과 목록 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
  <div className="flex justify-between items-center mb-2">
    <div>동영상 목록 (총 {pagination.totalElements}개)</div>
    <div className="flex space-x-2">
      <button 
        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
        onClick={deleteSelectedItems}
      >
        삭제
      </button>
    </div>
  </div>
        
         {/* 테이블 */}
        <VideoTable
          products={checkedProducts}
          pagination={pagination}
          isAllChecked={isAllChecked}
          handleAllCheck={handleAllCheck}
          handleItemCheck={handleItemCheck}
          handleProductStatusClick={handleStatusCheck}
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

      {showModal && (
          <AlertModal
            message={modalMessage}
            onClose={() => setShowModal(false)}
          />
      )}
        
      </div>
    </div>
  );
}

export default AdminBroadcast;