// src/pages/seller/Manage.jsx
import { useState, useEffect } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

import Keyword from '../../../common/components/search/Keyword';
import ProductStatus from '../../../common/components/search/ProductStatus';
import ProductCategory from '../../../common/components/search/ProductCategory';
import BasicBtn from '../../../common/components/search/BasicBtn';
import Pagination from '../../../common/components/Pagination';
import ProductDetailModal from './ProductDetailModal';

import { bigCategories, smallCategories } from '../../../common/js/categories'

import AlertModal from '../../../common/components/modal/AlertModal';

function Manage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({INSTOCK: true, PREORDER: false});
  // true 값만 포함하는 새로운 state
  const [processedFilters, setProcessedFilters] = useState({});
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [sortFilter, setSortFilter] = useState('LATEST');
  const [smallCategoriesFiltered, setSmallCategoriesFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAllChecked, setIsAllChecked] = useState(false);

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

  // 페이지 변경 핸들러 (POST)
  const handlePageChange = (page) => {
      setPagination(prevState => ({
      ...prevState,  // 이전 상태의 모든 속성을 복사
      currentPage: page // currentPage만 업데이트
    }));
  };

  useEffect(() => {
    fetchSearchProducts();
  }, [pagination.currentPage]); // pagination.currentPage가 변경될 때마다 fetchSearchProducts 호출
  

  // 상품명 클릭 시 수정 및 상세화면 출력
  const handleProductClick = (productId) => {
    fetchProductDetail(productId);
  };

    // 상품 상세 정보 조회 함수
    const fetchProductDetail = async (productId) => {
      setLoading(true);
      setModalOpen(true);
      
      try {
        // 백엔드 API 호출
        const response = await fetch(`http://localhost:8888/my/seller/item/detail/${productId}`);
  
        const httpResponse = await response.json();
        console.log('조회된 상품 정보:', httpResponse);
        
        // 조회 성공 시 상태 업데이트
        setProductDetail(httpResponse.data);
      } catch (error) {
        console.error('상품 상세 조회 오류:', error);
        
        // 에러 발생 시 임시 데이터로 대체 (백엔드 연동 전 테스트용)
        // 실제 구현 시 에러 메시지를 표시하거나 다른 처리를 해야 함
        setProductDetail({
          id: productId,
          title: `상품 ${productId}`,
          bigCategory: '과일',
          smallCategory: '사과',
          origin: '국내산',
          content: '<p>이 상품은 <strong>유기농으로 재배된</strong> 신선한 상품입니다.</p><p>자세한 정보는 상품 설명을 참고하세요.</p>',
          mainImage: 'https://via.placeholder.com/300',
          detailImages: [
            'https://via.placeholder.com/200',
            'https://via.placeholder.com/200'
          ],
          options: [
            { name: '기본', price: '10000', quantity: '15' },
            { name: '선물포장', price: '15000', quantity: '10' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };


  // 전체 선택/해제 핸들러
  const handleAllCheck = (event) => {
    const checked = event.target.checked;
    setIsAllChecked(checked);
    
    // 모든 상품의 체크박스 상태 업데이트
    const updatedProducts = products.map(product => ({
      ...product, 
      isChecked: checked
    }));
    
    setProducts(updatedProducts);
  };

  // 개별 상품 체크박스 핸들러
  const handleItemCheck = (id) => {
    const updatedProducts = products.map(product => 
      product.saleId === id 
        ? { ...product, isChecked: !product.isChecked } 
        : product
    );
    
    setProducts(updatedProducts);
    
    // 전체 선택 상태 업데이트
    const allChecked = updatedProducts.every(product => product.isChecked);
    setIsAllChecked(allChecked);
  };
  
  // 초기 GET 데이터 로드 함수
  const fetchInitialProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/my/seller/sale/search');
      
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
      setError(error.message);
      console.error('초기 상품 데이터 로딩 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  }

    //초기 데이터 로드 (GET)
    useEffect(() => {
      fetchInitialProducts();
    }, []);

  // 상품 데이터 및 페이지네이션 POST API 함수
  const fetchSearchProducts = async () => {
    setIsLoading(true);
    setError(null);

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
      const response = await fetch('http://localhost:8080/my/seller/sale/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteSelectedItems = async() => {
    //체크박스 안의 id값을 배열로 뽑아내기 
    const selectedProducts = products.filter(product => product.isChecked);
    const selectedProductIds = selectedProducts.map(product => product.saleId);
    console.log('선택된 상품들:', selectedProductIds);
    try {
      // JSON 형태로 가공
      const request = {
        saleIds: selectedProductIds
      };
      
      // fetch API를 사용하여 서버로 요청 보내기
      const response = await fetch('http://localhost:8888/my/seller/item/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request) // JSON 문자열로 변환
      });
      
      // 응답 처리
      if (response.status === 200) {
        setModalMessage('삭제성공.');
        setShowModal(true);
        // 성공 후 처리 (Post방식으로 값 다시 불러오기)
        fetchSearchProducts();
        
      } else {
        console.error('삭제 실패:', response.statusText);
        // 실패 처리 (예: 에러 메시지 표시)
      }
    } catch (error) {
      console.error('요청 오류:', error);
      // 오류 처리
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
      INSTOCK: true,
      PREORDER: false
    });
    setCategory('');
    setSubCategory('');
    setSortFilter('LATEST');
    fetchInitialProducts(); //get방식 데이터 불러오기
  };
  
  // 에러 및 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div role="status">
          <svg 
            aria-hidden="true" 
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" 
            viewBox="0 0 100 101" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG 로딩 스피너 */}
            <path d="..." fill="currentColor" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">오류 발생! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b">상품 조회/수정</h1>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
       
       {/* 검색창 구현(컴포넌트 */}
      <Keyword 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          sortFilter={sortFilter} 
          setSortFilter={setSortFilter} 
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
        
        <TableContainer component={Paper} className="mb-4">
          <Table size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: '#4b4b4b' }}>
                <TableCell padding="checkbox">
                  <Checkbox color="default" 
                            checked={isAllChecked}
                            onChange={handleAllCheck}
                  />
                </TableCell>
                <TableCell style={{ color: 'white' }}>번호</TableCell>
                <TableCell style={{ color: 'white' }}>상품명</TableCell>
                <TableCell style={{ color: 'white' }}>판매가</TableCell>
                <TableCell style={{ color: 'white' }}>판매상태</TableCell>
                <TableCell style={{ color: 'white' }}>재고 수량</TableCell>
                <TableCell style={{ color: 'white' }}>주문 수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.saleId}>
                  <TableCell padding="checkbox">
                    <Checkbox color="default" 
                              checked={product.isChecked || false}
                              onChange={() => handleItemCheck(product.saleId)}
                    />
                    
                  </TableCell>
                  <TableCell>{pagination.currentPage * pagination.pageSize + index + 1}</TableCell>
                  <TableCell 
                  onClick={() => handleProductClick(product.saleId)}
                  className="cursor-pointer hover:bg-gray-100"
                  >{product.title}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <button 
                      className={`text-xs py-1 px-2 rounded ${
                        product.blind === true 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-teal-500 hover:bg-teal-600 text-white'
                      }`}
                    >
                      {product.blind === true ? "판매 중지" : "판매 중"}
                    </button>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.orderCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
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

export default Manage;