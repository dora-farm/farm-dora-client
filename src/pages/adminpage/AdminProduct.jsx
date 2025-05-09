// src/pages/seller/Manage.jsx
import { useState, useEffect, useRef } from 'react';
import { fetchWithAuthConvert } from '../../common/utils/fetchWithAuthConvert';

import Keyword from '../../common/components/search/Keyword';
import ProductStatus from '../../common/components/search/ProductStatus';
import ProductCategory from '../../common/components/search/ProductCategory';
import BasicBtn from '../../common/components/search/BasicBtn';
import Pagination from '../../common/components/Pagination';
import ProductDetailModal from './ProductModalAdmin';

import { bigCategories, smallCategories } from '../../common/js/categories'

//componentes
import AlertModal from '../../common/components/modal/AlertModal';
import Loading from '../../common/components/Loading';
import ProductTable from '../../common/components/product/ProductTable';
//hooks
import { useCheckboxes } from '../../common/hooks/useCheckboxes';

function AdminProduct() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ INSTOCK: false, PREORDER: false });
  // true 값만 포함하는 새로운 state
  const [processedFilters, setProcessedFilters] = useState({});
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [products, setProducts] = useState([]);

  const [sortFilter, setSortFilter] = useState('LATEST');
  const [smallCategoriesFiltered, setSmallCategoriesFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  // 검색창 포커스
  const searchInputRef = useRef(null);


  // 모달(상세페이지)
  const [modalOpen, setModalOpen] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // 모달(알림)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    pageSize: 15
  });

  const {
    items: checkedProducts,
    isAllChecked,
    handleAllCheck,
    handleItemCheck,
    getSelectedIds,
    setItems: setCheckboxItems
  } = useCheckboxes([], `saleId`);

  // 검색 결과가 변경되면 체크박스 상태 업데이트
  useEffect(() => {
    setCheckboxItems(products);
  }, [products, setCheckboxItems]);

  // 페이지 변경 핸들러 (POST)
  const handlePageChange = (page) => {
    setPagination(prevState => ({
      ...prevState,  // 이전 상태의 모든 속성을 복사
      currentPage: page // currentPage만 업데이트
    }));
  };

  const handleStatusCheck = async (productId) => {

    try {

      // fetch API를 사용하여 서버로 요청 보내기
      const response = await fetchWithAuthConvert(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/my/seller/item/updateStatus/${productId}`, {
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


  useEffect(() => {
    fetchSearchProducts();
  }, [pagination.currentPage]); // pagination.currentPage가 변경될 때마다 fetchSearchProducts 호출

  // 상품 상세 정보 조회 함수
  const fetchProductDetail = async (productId) => {
    setLoading(true);
    setModalOpen(true);

    try {
      // 백엔드 API 호출
      const response = await fetchWithAuthConvert(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/my/seller/item/detail/${productId}`);

      const httpResponse = await response.json();
      // console.log('조회된 상품 정보:', httpResponse);

      // 조회 성공 시 상태 업데이트
      setProductDetail(httpResponse.data);
    } catch (error) {
      console.error('상품 상세 조회 오류:', error);
    } finally {
      setLoading(false);
    };
  };

  // 초기 GET 데이터 로드 함수
  const fetchInitialProducts = async () => {
    setIsLoading(true);

    try {
      const response = await fetchWithAuthConvert(`${import.meta.env.VITE_SEARCH_REST_API_URL}/my/admin/sale`);

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
      // 초기화 후 즉시 검색 실행
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
      sellerId: 1, // 추후 JWT 토큰으로 백에서 처리 예정
      keyword: searchTerm,
      sort: sortFilter,
      filters: processedFilters,
      typeBigId: category,
      typeId: subCategory,
      page: pagination.currentPage,
      size: pagination.pageSize
    };

    try {
      const response = await fetchWithAuthConvert(`${import.meta.env.VITE_SEARCH_REST_API_URL}/my/admin/sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });

      // 응답 텍스트 확인
      const httpResponse = await response.json();
      // console.log('서버 응답:', httpResponse.data);
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
  const deleteSelectedItems = async () => {
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
        saleIds: selectedProductIds
      };

      // fetch API를 사용하여 서버로 요청 보내기
      const response = await fetchWithAuthConvert(`${import.meta.env.VITE_PRODUCT_REST_API_URL}/my/seller/item/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // 대분류 선택 시 소분류 필터링
  useEffect(() => {
    if (category) {
      const filteredCategories = smallCategories.filter(
        item => item.bigCategoryId === parseInt(category)
      );
      setSmallCategoriesFiltered(filteredCategories);
      setSubCategory('');
    } else {
      setSmallCategoriesFiltered([]);
      setSubCategory('');
    }
  }, [category]);

  const handleFilterChange = (event) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [event.target.name]: event.target.checked
    }));
  };

  useEffect(() => {
    // true 값을 가진 키만 배열로 추출
    const trueKeysArray = Object.keys(filters).filter(key => filters[key] === true);
    setProcessedFilters(trueKeysArray);
  }, [filters]);

  // 검색 및 필터링 핸들러 (POST)
  const handleSearch = () => {
    setPagination(
      pagination.currentPage = 0
    );
    fetchSearchProducts();
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      INSTOCK: false,
      PREORDER: false
    });
    setCategory('');
    setSubCategory('');
    setSortFilter('LATEST');
    fetchInitialProducts(); //get방식 데이터 불러오기
  };

  // 로딩 상태 렌더링
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b">상품 조회</h1>

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
          <ProductStatus
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
          <ProductCategory
            category={category}
            setCategory={setCategory}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            bigCategories={bigCategories}
            smallCategoriesFiltered={smallCategoriesFiltered}
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
          <div>상품 목록 (총 {pagination.totalElements}개)</div>
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
            onClick={deleteSelectedItems}
          >
            선택 삭제
          </button>
        </div>

        {/* 테이블 */}
        <ProductTable
          products={checkedProducts}
          pagination={pagination}
          isAllChecked={isAllChecked}
          handleAllCheck={handleAllCheck}
          handleItemCheck={handleItemCheck}
          handleProductClick={fetchProductDetail}
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

        {/* 상품 상세 정보 모달 */}
        <ProductDetailModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          productDetail={productDetail}
          loading={loading}
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

export default AdminProduct;