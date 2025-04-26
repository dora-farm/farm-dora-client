import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../dashboard/components/DashboardLayout';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CancelIcon from '@mui/icons-material/Cancel';
import RateReviewIcon from '@mui/icons-material/RateReview';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
function Exchange() {
  const location = useLocation();
  
  // 각 메뉴 항목 정의 (MUI 아이콘 사용)
  const menuItems = [
    { id: 'order', label: '주문 조회', count: null, icon: <SearchIcon />, path: '/my/seller/order', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'new', label: '신규주문', count: 15, icon: <InventoryIcon />, path: '/my/seller/order/new', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'exchange', label: '교환관리', count: 10, icon: <SyncAltIcon />, path: '/my/seller/order/exchange', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'refund', label: '반품관리', count: 3, icon: <KeyboardReturnIcon />, path: '/my/seller/order/refund', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'cancel', label: '취소관리', count: 1, icon: <CancelIcon />, path: '/my/seller/order/cancel', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'review', label: '리뷰관리', count: 20, icon: <RateReviewIcon />, path: '/my/seller/order/review', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'inquiry', label: '문의관리', count: 20, icon: <HelpOutlineIcon />, path: '/my/seller/order/inquiry', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
  ];

  // 현재 경로가 메뉴 항목의 경로와 일치하는지 확인
  const getButtonStyle = (itemPath) => {
    const isActive = location.pathname === itemPath;
    
    // 현재 활성화된 항목에 대한 스타일 반환
    return isActive ? 'bg-opacity-90 font-bold' : '';
  };

  // 현재 경로에 따른 배경색 결정
  const getButtonColor = (item) => {
    const isActive = location.pathname === item.path;
    return isActive ? item.activeColor : item.defaultColor;
  };

  return (
    <DashboardLayout>
      <DashboardHeader title={"주문 관리"} />
      <div className='mt-4 border-b pb-4'>
        <div className='flex flex-wrap gap-2'>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${getButtonColor(item)} border border-gray-200 hover:bg-opacity-80 transition-colors ${getButtonStyle(item.path)}`}

            >
              <span className="text-gray-700">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.count !== null && (
                <span className="ml-1 text-sm font-semibold">{item.count}건</span>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* 여기에 주문 관리 컨텐츠 추가 */}
      <div className='mt-4 border-2 p-4'>
        {/* 검색 및 필터 영역 */}
      </div>
    </DashboardLayout>
  );
}

export default Exchange