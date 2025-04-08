import React from 'react';
import { Link } from "react-router-dom";

function UserSidebar() {
  const linkClass = "text-left px-4 py-2 rounded-md hover:bg-gray-100 transition";

  return (
    <div className="flex-col w-[250px] h-screen rounded-xl p-4 mt-7 border-2 border-gray-dark max-w-[250px]">
      
      {/* 활동 정보 */}
      <h2 className="font-bold text-xl border-b-2 border-gray-dark pb-3 pl-2">
        활동 정보
      </h2>
      <nav className="mt-6 flex flex-col gap-1">
        <Link to="/my/user" className={linkClass}>마이페이지</Link>
        <Link to="/my/user/wishlist" className={linkClass}>찜한 상품</Link>
        <Link to="/my/user/cart" className={linkClass}>장바구니</Link>
        <Link to="/my/user/review" className={linkClass}>내 리뷰 보기</Link>
        <Link to="/my/user/inquiry" className={linkClass}>내 문의 보기</Link>
      </nav>

      {/* 쇼핑 정보 */}
      <h2 className="font-bold text-xl border-b-2 border-gray-dark pb-3 pl-2 mt-12">
        쇼핑 정보
      </h2>
      <nav className="mt-6 flex flex-col gap-1">
        <Link to="/my/user/order" className={linkClass}>주문 내역</Link>
        <Link to="/my/user/address" className={linkClass}>배송지 관리</Link>
      </nav>

      {/* 개인정보 */}
      <h2 className="font-bold text-xl border-b-2 border-gray-dark pb-3 pl-2 mt-12">
        개인정보
      </h2>
      <nav className="mt-6 flex flex-col gap-1">
        <Link to="/my/user/profile" className={linkClass}>회원정보 수정</Link>
        <Link to="/my/user/withdraw" className={linkClass}>회원 탈퇴</Link>
      </nav>
    </div>
  );
}

export default UserSidebar;
