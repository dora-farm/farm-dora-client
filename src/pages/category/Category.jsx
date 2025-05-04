import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Pagination from "../../common/components/Pagination";
import { useCategory } from '../../layouts/CategoryContext';
import { fetchWithAuth } from '../../common/utils/fetchWithAuth';
import ProductCard from '../../common/components/ProductCard';
import { useLikeToggle } from '../user/hooks/useLikeToggle';
import { getCookie } from '../../common/utils/Cookies';

function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type_id = parseInt(searchParams.get('type_id') || '0', 10);
  const initialTypeBigId = parseInt(searchParams.get('type_big_id') || '0', 10);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(searchParams.get('sort') || 'RECOMMEND');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [token, setToken] = useState(null);
  const { toggleLike: toggleLikeFn } = useLikeToggle(token);

  // 카테고리 Context
  const { loading: categoryLoading, getMainCategoryById, getSubCategoryById, getSubCategoriesByMainId } = useCategory();

  const subCategory = type_id > 0 ? getSubCategoryById(type_id) : null;
  const type_big_id = subCategory ? subCategory.type_big_id : initialTypeBigId;

  const mainCategory = type_big_id > 0 ? getMainCategoryById(type_big_id) : null;
  const subCategories = type_big_id > 0 ? getSubCategoriesByMainId(type_big_id) : [];

  useEffect(() => {
    const jwtToken = getCookie('jwt_token');
    setToken(jwtToken);
  }, []);

  // 상품 목록 가져오기
  useEffect(() => {
    if (!token || (type_big_id === 0 && type_id === 0)) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let apiUrl = `${import.meta.env.VITE_SEARCH_REST_API_URL}/sale/type?sort=${sort}&page=${page - 1}`;

        if (type_id > 0) {
          apiUrl += `&typeId=${type_id}`;
        } else if (type_big_id > 0) {
          apiUrl += `&bigTypeId=${type_big_id}`;
        }

        console.log('요청: ', apiUrl);

        const productsResponse = await fetchWithAuth(apiUrl);
        const productsData = await productsResponse.json();

        setProducts(productsData.data.contents);
        setTotalPages(productsData.data.totalPages);
        setTotalElements(productsData.data.totalElements);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type_big_id, type_id, sort, page, searchParams, token]);

  const toggleLike = (saleId, isLiked) => {
    toggleLikeFn(saleId, isLiked, () => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.saleId === saleId ? { ...product, liked: !product.liked } : product
        )
      );
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: newPage + 1,
      sort,
      ...(type_big_id > 0 && { type_big_id }),
      ...(type_id > 0 && { type_id }),
    });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      sort: newSort,
      page,
      ...(type_big_id > 0 && { type_big_id }),
      ...(type_id > 0 && { type_id }),
    });
  };

  const renderProductList = (products) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard
            key={product.saleId}
            saleId={product.saleId}
            title={product.title}
            mainImage={product.mainImage}
            minPrice={product.minPrice}
            liked={product.liked}
            onToggleLike={() => toggleLike(product.saleId, product.liked)}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-dark">해당 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );

  if (loading || categoryLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  if (type_id === 0 && type_big_id === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-dark">상품 목록이 존재하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{type_id > 0 ? subCategory?.name : mainCategory?.name}</h1>
        <p className="text-gray-dark">
          홈 &gt; {mainCategory?.name}{type_id > 0 && <> &gt; {subCategory?.name}</>}
        </p>
      </div>

      {type_id === 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">카테고리</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subCategories.map(subCategory => (
              <Link
                key={subCategory.type_id}
                to={`/category?type_id=${subCategory.type_id}`}
                className="block p-4 border rounded-lg text-center hover:border-green hover:text-green transition-colors"
              >
                {subCategory.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 p-4 bg-gray-light rounded-lg">
        <div className="flex flex-wrap justify-between items-center">
          <span className="mr-2">
            총 <span className="text-green font-bold">{totalElements}</span>개 상품
          </span>
          <div className="relative">
            <select
              value={sort}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-2 py-1 appearance-none pr-8"
            >
              <option value="RECOMMEND">추천순</option>
              <option value="ORDER_DESC">주문수 ↓</option>
              <option value="ORDER_ASC">주문수 ↑</option>
              <option value="REVIEW_DESC">리뷰수 ↓</option>
              <option value="PRICE_DESC">가격 ↓</option>
              <option value="PRICE_ASC">가격 ↑</option>
            </select>
            <ArrowDropDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {renderProductList(products)}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page - 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasPrev={page > 1}
            hasNext={page < totalPages}
            pageButtonCount={5}
            activeColor="bg-green"
            hoverColor="hover:bg-gray-100"
          />
        </div>
      )}
    </div>
  );
}

export default Category;