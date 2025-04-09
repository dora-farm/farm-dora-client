import React from 'react';
import { Link } from 'react-router-dom';

function SellerSidebar() {
  const linkClass = "text-left text-gray px-4 py-2 rounded-md hover:bg-[#5A514F] transition";

  return (
    <div className="flex flex-col w-[250px] h-screen p-4 bg-brown max-w-[250px]">
      
      <nav className="flex flex-col gap-1">
      <Link to="/my/seller" className="text-left text-gray-light text-lg font-bold px-4 py-2 rounded-md hover:bg-[#5A514F] transition">H O M E</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/my/seller/order" className={linkClass}>주문 관리</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/my/seller/item/manage" className={linkClass}>상품 관리</Link>
        <Link to="/my/seller/item/register" className={linkClass}>상품 등록</Link>
        <Link to="/my/seller/live" className={linkClass}>LIVE 스트리밍</Link>
      </nav>
    </div>
  );
}

export default SellerSidebar;
