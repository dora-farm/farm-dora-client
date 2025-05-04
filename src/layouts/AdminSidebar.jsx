import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const btnHover = "text-left text-gray-light px-4 py-2 rounded-xl hover:bg-[#5A514F] transition";
  const homebtn = "text-left text-gray-light text-lg rounded-xl font-bold px-4 py-2 transition";
  const activeBtn = "text-left text-gray-light px-4 py-2 rounded-xl bg-[#5A514F] transition";
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-[250px] p-4 bg-brown max-w-[250px] min-w-[250px]">
      <nav className="flex flex-col gap-1">
        <Link to="/admin" className={homebtn}>H O M E</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/admin/user" className={activePath === "/admin/user" ? activeBtn : btnHover}>사용자 관리</Link>
        <Link to="/admin/review" className={activePath === "/admin/review" ? activeBtn : btnHover}>리뷰 관리</Link>
        <Link to="/admin/broadcast" className={activePath === "/admin/broadcast" ? activeBtn : btnHover}>방송 관리</Link>
        <Link to="/admin/seller/approval" className={activePath === "/admin/seller/approval" ? activeBtn : btnHover}>판매자 승인</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/admin/popup" className={activePath === "/admin/popup" ? activeBtn : btnHover}>팝업/배너 관리</Link>
        <Link to="/admin/popup/register" className={activePath === "/admin/popup/register" ? activeBtn : btnHover}>팝업/배너 등록</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/admin/product" className={activePath === "/admin/product" ? activeBtn : btnHover}>상품 관리</Link>
      </nav>
    </div>
  );
}

export default AdminSidebar;