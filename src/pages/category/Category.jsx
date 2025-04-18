import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { Pagination } from '@mui/material';

function Category() {
  const [searchParams] = useSearchParams();
  const type_big_id = parseInt(searchParams.get('type_big_id') || '0', 10);
  const type_id = parseInt(searchParams.get('type_id') || '0', 10);
  const [mainCategory, setMainCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null); // 소분류만 담은 정보
  const [subCategories, setSubCategories] = useState([]); // 대분류에 속한 모든 소분류에 관한 정보
  const [products, setProducts] = useState([]); // 제품 목록
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. 대분류 카테고리 데이터 가져오기
        const mainCategoryResponse = await fetch('/mock/option-type-big.json');
        const mainCategoryData = await mainCategoryResponse.json();

        // type_big_id와 일치하는 대분류 카테고리 찾기
        const selectedMainCategory = mainCategoryData.find(selectedMainCategory => selectedMainCategory.type_big_id === type_big_id);
        setMainCategory(selectedMainCategory);
        
        // 2. 소분류 카테고리 데이터 가져오기
        const subCategoryResponse = await fetch('/mock/option-type.json');
        const subCategoryData = await subCategoryResponse.json();

        // 현재 대분류에 속한 소분류 필터링
        const filteredSubCategories = subCategoryData.filter(selectedSubCategory => selectedSubCategory.type_big_id === type_big_id);
        setSubCategories(filteredSubCategories);
        console.log("대분류에 속한 모든 아이템", filteredSubCategories)
        
        // 소분류 ID가 있는 경우 해당 소분류 정보 찾기
        if (type_id > 0) {
          const selectedSubCategory = filteredSubCategories.find(selectedSubCategory => selectedSubCategory.type_id === type_id);
          setSubCategory(selectedSubCategory);
          console.log("선택된 소분류에 관한 필터", selectedSubCategory)
        }
        
        // todo : `/api/products?type_big_id=${type_big_id}&type_id=${type_id}`
        const productsResponse = await fetch('/mock/products.json');
        const productsData = await productsResponse.json();
        
        // 소분류 ID가 있는 경우, 해당 소분류에 속한 제품만 필터링
        // 참고: 실제 구현에서는 이 필터링을 백엔드에서 수행해야 함 임시로 mock 데이터로 구현
        let filteredProducts = [];
        if (type_id > 0) {
          filteredProducts = productsData.filter(product => product.type_id === type_id);
        }
        // 대분류 ID만 있는 경우, 해당 대분류에 속한 모든 소분류의 제품 필터링
        else if (type_big_id > 0) {
          const typeIds = filteredSubCategories.map(subCategories => subCategories.type_id);
          filteredProducts = productsData.filter(product => typeIds.includes(product.type_id));
        }
        
        setProducts(filteredProducts);
        
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (type_big_id > 0) {
      fetchData();
    }
  }, [type_big_id, type_id]);

  // 로딩 상태
  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  // 공통 제품 렌더링 함수
  const renderProductList = (products) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={product.is_main} alt={product.name} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2">
                {product.liked ? <Favorite className="text-danger" /> : <FavoriteBorder />}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm">{product.name}</h3>
              <p className="text-lg font-bold mt-2">{product.price.toLocaleString()}원</p>
              <p className="text-xs text-gray-dark mt-1">{product.description}</p>
              <div className="mt-3 flex justify-between">
                <button className="text-sm text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-600 hover:text-white transition-colors">장바구니</button>
                <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">구매하기</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-dark">해당 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );

  // 소분류가 선택된 경우 소분류 페이지 렌더링
  if (type_id > 0 && subCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{subCategory.name}</h1>
          <p className="text-gray-dark">홈 &gt; {mainCategory.name} &gt; {subCategory.name}</p>
        </div>
        
        <div className="mb-8 p-4 bg-gray-light rounded-lg">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-2 md:mb-0">
              <span className="mr-2">총 <span className="text-green font-bold">{products.length}</span>개 상품</span>
            </div>
          </div>
        </div>
        
        {/* 제품 목록 */}
        {renderProductList(products)}
      </div>
    );
  }

  // 대분류만 선택된 경우 대분류 페이지 렌더링
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{mainCategory.name}</h1>
        <p className="text-gray-dark">홈 &gt; {mainCategory.name}</p>
      </div>
      
      {/* 서브카테고리 목록 */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">카테고리</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subCategories.map(subCategory => (
            <Link 
              key={subCategory.type_id} 
              to={`/category?type_big_id=${type_big_id}&type_id=${subCategory.type_id}`}
              className="block p-4 border rounded-lg text-center hover:border-green hover:text-green transition-colors"
            >
              {subCategory.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-light rounded-lg">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-2 md:mb-0">
              <span className="mr-2">총 <span className="text-green font-bold">{products.length}</span>개 상품</span>
            </div>
          </div>
        </div>
      
      {/* 제품 목록 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">인기 상품</h2>
        {renderProductList(products)}
      </div>
      <Pagination/>
    </div>
  );
}

export default Category;