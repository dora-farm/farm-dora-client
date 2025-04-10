import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

function UserSidebar() {
  const btnHover = "text-left px-4 py-2 rounded-xl hover:bg-gray-100 transition";
  const activeBtn = "text-left px-4 py-2 rounded-xl bg-gray-100 transition";
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex-col w-[250px] h-screen rounded-xl p-4 mt-7 border-2 border-gray-dark max-w-[250px] min-w-[250px]">

      {/* 활동 정보 */}
      <h2 className="font-bold text-xl border-b-2 border-gray-dark pb-3 pl-2">
        활동 정보
      </h2>
      <nav className="mt-6 flex flex-col gap-1">
        <Link to="/my/user" className={activePath === "/my/user" ? activeBtn : btnHover}>마이페이지</Link>
        <Link to="/my/user/wishlist" className={activePath === "/my/user/wishlist" ? activeBtn : btnHover}>찜한 상품</Link>
        <Link to="/my/user/cart" className={activePath === "/my/user/cart" ? activeBtn : btnHover}>장바구니</Link>
        <Link to="/my/user/review" className={activePath === "/my/user/review" ? activeBtn : btnHover}>내 리뷰 보기</Link>
        <Link to="/my/user/inquiry" className={activePath === "/my/user/inquiry" ? activeBtn : btnHover}>내 문의 보기</Link>
      </nav>

      {/* 쇼핑 정보 */}
      <h2 className="font-bold text-xl border-b-2 border-gray-dark pb-3 pl-2 mt-12">
        쇼핑 정보
      </h2>
      <nav className="mt-6 flex flex-col gap-1">
        <Link to="/my/user/order" className={activePath === "/my/user/order" ? activeBtn : btnHover}>주문 내역</Link>
        <Link to="/my/user/address" className={activePath === "/my/user/address" ? activeBtn : btnHover}>배송지 관리</Link>
      </nav>

      {/* 개인정보 */}
      <h2 className="font-bold text-xl border-b-2 border-gray-dark pb-3 pl-2 mt-12">
        개인정보
      </h2>
      <nav className="mt-6 flex flex-col gap-1">
        <Link to="/my/user/profile" className={activePath === "/my/user/profile" ? activeBtn : btnHover}>회원정보 수정</Link>
        <Link to="/my/user/withdraw" className={activePath === "/my/user/withdraw" ? activeBtn : btnHover}>회원 탈퇴</Link>
      </nav>
    </div>
  );
}

export default UserSidebar;