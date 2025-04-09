import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { KeyboardArrowDown, Search, FavoriteBorder, PersonOutlineOutlined, ShoppingBagOutlined } from '@mui/icons-material';

function Header({ maincategories, subCategories, loading }) {
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRef = useRef(null);
  const dropdownRef = useRef(null);

  // 카테고리 토글(열기/닫기)
  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  // 마우스가 드롭다운 영역을 벗어났을 때 닫기
  const handleMouseLeave = () => {
    setIsCategoryOpen(false);
  };

  // 카테고리에 마우스 올렸을 때 처리 함수
  const handleCategoryHover = (typeBigId) => {
    setActiveCategory(typeBigId);
  };

  // 메인 카테고리 선택 처리
  const handleCategorySelect = (typeBigId) => {
    navigate(`/category?type_big_id=${typeBigId}`);
    setIsCategoryOpen(false);  // 드롭다운 닫기
  };

  // 서브 카테고리 선택 처리
  const handleSubCategorySelect = (typeBigId, typeId) => {
    navigate(`/category?type_big_id=${typeBigId}&type_id=${typeId}`);
    setIsCategoryOpen(false);  // 드롭다운 닫기
  };

  // 현재 활성화된 카테고리의 소분류 가져오기
  const getActiveSubCategories = () => {
    return subCategories.filter(subCategory => subCategory.type_big_id === activeCategory);
  };

  return (
    <header className="w-full bg-white border-b">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="flex items-center justify-between py-4">
          <div className="">
            <Link to="/">
              <img src={logo} alt="로고" className='w-40 h-15'/>
            </Link>
          </div>
          
          <div className="relative flex-grow max-w-md mx-10">
            <input 
              type="text" 
              className="w-full py-2 pl-4 pr-10 border rounded-full border-green focus:outline-none"
              placeholder="검색어를 입력해주세요"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search/>
            </button>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-sm">로그인</Link>
            <Link to="/join" className="text-sm">회원가입</Link>
            {/* 구매자 마이페이지 */}
            <Link to="/my/user">
              <PersonOutlineOutlined/>
            </Link>
            {/* 판매자 마이페이지 */}
            <Link to="/my/seller">
              <PersonOutlineOutlined/>
            </Link>
            {/* 관리자 페이지 */}
            <Link to="/admin">
              <PersonOutlineOutlined/>
            </Link>
            <Link to="/wishlist">
              <FavoriteBorder/>
            </Link> 
            <Link to="/cart" className="relative">
              <ShoppingBagOutlined/>
              <span className="absolute -top-2 -right-2 bg-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* 하단 네비게이션 */}
      <div className="border-t">
        <nav className="mx-auto max-w-[1300px] px-4">
          <ul className="flex items-center py-3 space-x-8">
            <li className="relative" ref={categoryRef}>
              <button 
                className={`flex items-center ${isCategoryOpen ? 'text-green' : ''}`}
                onClick={toggleCategory}  // 클릭 이벤트로 토글
              >
                <span className='ml-2'>카테고리</span>
                <KeyboardArrowDown
                  className={`h-4 w-4 ml-1 transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              
              {/* 카테고리 드롭다운 */}
              {isCategoryOpen && !loading && (
                <div 
                  className="absolute top-full left-0 z-50 mt-1 bg-white shadow-lg border rounded w-[600px] flex divide-x"
                  ref={dropdownRef}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* 왼쪽 메인 카테고리 - 고정 높이 */}
                  <div className="py-2 w-1/2 h-80 overflow-y-auto">
                  {maincategories.map((maincategory) => (
                    <div
                      key={maincategory.type_big_id} 
                      className={`block px-4 py-2 cursor-pointer ${
                        activeCategory === maincategory.type_big_id ? 'bg-green text-white' : 'hover:bg-green hover:text-white'
                      }`}
                      onClick={() => handleCategorySelect(maincategory.type_big_id)}
                      onMouseEnter={() => handleCategoryHover(maincategory.type_big_id)}
                    >
                      {maincategory.name}
                    </div>
                  ))}
                  </div>
                  
                  {/* 오른쪽 서브 카테고리 - 동적 높이 */}
                  <div className="py-2 w-1/2 max-h-80 overflow-y-auto">
                    {activeCategory && getActiveSubCategories().map((subCategory) => (
                      <div
                        key={subCategory.type_id} 
                        className="block px-4 py-2 hover:bg-green hover:text-white cursor-pointer"
                        onClick={() => handleSubCategorySelect(activeCategory, subCategory.type_id)}
                      >
                        {subCategory.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <li className="relative group">
              <Link 
                to="/event" 
                className="block py-1 relative"
              >
                이벤트
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green transform translate-y-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></span>
              </Link>
            </li>
            <li className="relative group">
              <Link
                to="/live" 
                className="block py-1 relative"
              >
                LIVE
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green transform translate-y-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></span>
              </Link>
            </li>
            <li className="relative group">
              <Link 
                to="/support" 
                className="block py-1 relative"
              >
                고객센터
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green transform translate-y-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;