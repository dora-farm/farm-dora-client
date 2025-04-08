import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  const linkClass = "text-left text-gray px-4 py-2 rounded-md hover:bg-[#5A514F] transition";

  return (
    <div className="flex flex-col w-[250px] h-screen p-4 bg-brown max-w-[250px]">
      
      <nav className="flex flex-col gap-1">
      <Link to="/admin" className="text-left text-gray-light text-lg font-bold px-4 py-2 rounded-md hover:bg-[#5A514F] transition">H O M E</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/admin/user" className={linkClass}>사용자 관리</Link>
        <Link to="/admin/review" className={linkClass}>리뷰 관리</Link>
        <Link to="/admin/broadcast" className={linkClass}>방송 관리</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/admin/popup" className={linkClass}>팝업/배너 관리</Link>
        <Link to="/admin/popup/register" className={linkClass}>팝엽/배너 등록</Link>
      </nav>

      <div className="border-t-2 border-gray-light my-4" />

      <nav className="flex flex-col gap-1">
        <Link to="/admin/product" className={linkClass}>상품 관리</Link>
      </nav>
    </div>
  );
}

export default AdminSidebar;
