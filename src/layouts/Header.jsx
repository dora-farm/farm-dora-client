import logo from '../assets/images/logo.png';

function Header() {
  return (
    <header className="w-full bg-white border-b">
      {/* 상단 헤더 */}
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="flex items-center justify-between py-4">
          {/* 로고 */}
          <div className="">
            <a href="/">
              <img src={logo} alt="로고" className='w-40 h-15'/>
            </a>
          </div>
          
          {/* 검색창 */}
          <div className="relative flex-grow max-w-md mx-10">
            <input 
              type="text" 
              className="w-full py-2 pl-4 pr-10 border rounded-full border-green-500 focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* 오른쪽 메뉴들 */}
          <div className="flex items-center space-x-6">
            <a href="/login" className="text-sm">로그인</a>
            <a href="/join" className="text-sm">회원가입</a>

            <a href="/wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </a>
            <a href="/mypage">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
            <a href="/cart" className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* 하단 네비게이션 */}
      <div className="border-t">
        <nav className="mx-auto max-w-[1300px] px-4">
          <ul className="flex items-center py-3 space-x-8">
            <li>
              <button className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                카테고리
              </button>
            </li>
            <li><a href="/event">이벤트</a></li>
            <li><a href="/live">LIVE</a></li>
            <li><a href="/support">고객센터</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;