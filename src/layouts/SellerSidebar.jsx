import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function SellerSidebar() {
  const btnHover = "text-left text-gray-light px-4 py-2 rounded-xl hover:bg-[#5A514F] transition";
  const homebtn = "text-left text-gray-light text-lg rounded-xl font-bold px-4 py-2 transition";
  const activeBtn = "text-left text-gray-light px-4 py-2 rounded-xl bg-[#5A514F] transition";
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-[250px] h-screen p-4 bg-brown max-w-[250px]">

      <nav className="flex flex-col gap-1">
        <Link
          to="/my/seller"
          className={homebtn}
        >
          H O M E
        </Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link
          to="/my/seller/order"
          className={activePath === "/my/seller/order" ? activeBtn : btnHover}
        >
          주문 관리
        </Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link
          to="/my/seller/item/manage"
          className={activePath === "/my/seller/item/manage" ? activeBtn : btnHover}
        >
          상품 관리
        </Link>
        <Link
          to="/my/seller/item/register"
          className={activePath === "/my/seller/item/register" ? activeBtn : btnHover}
        >
          상품 등록
        </Link>
        <Link
          to="/my/seller/live"
          className={activePath === "/my/seller/live" ? activeBtn : btnHover}
        >
          LIVE 스트리밍
        </Link>
      </nav>
    </div>
  );
}

export default SellerSidebar;