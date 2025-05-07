import React, { useEffect, useState } from 'react';
import axios from '../../../common/utils/axiosInstance';
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

import Order from './Order';
import New from './New';
import Exchange from './Exchange';
import Refund from './Refund';
import Cancel from './Cancel';
import Review from './Review';
import Question from './Inquiry';

function OrdermanageHome() {
  const location = useLocation();
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    newOrders: 0,
    exchangeOrders: 0,
    refundOrders: 0,
    cancelOrders: 0,
    reviewCount: 0,
    questionCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  const loadOrderCounts = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_ACTIVITY_REST_API_URL}/my/seller/order`
      );

      if (response.status === 200) {
        setStatistics(response.data.data);
      } else {
        throw new Error('주문 관리 데이터 로딩에 실패했습니다.');
      }
    } catch(error) {
      console.error('주문 관리 데이터 로딩 오류', error)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderCounts();
  }, []);
  
  // 각 메뉴 항목 정의 (MUI 아이콘 사용)
  const menuItems = [
    { id: 'order', label: '주문 조회', count: statistics.totalOrders || 0, icon: <SearchIcon />, path: '/my/seller/order', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'new', label: '신규주문', count: statistics.newOrders || 0, icon: <InventoryIcon />, path: '/my/seller/order/new', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'exchange', label: '교환관리', count: statistics.exchangeOrders || 0, icon: <SyncAltIcon />, path: '/my/seller/order/exchange', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'refund', label: '반품관리', count: statistics.refundOrders || 0, icon: <KeyboardReturnIcon />, path: '/my/seller/order/refund', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'cancel', label: '취소관리', count: statistics.cancelOrders || 0, icon: <CancelIcon />, path: '/my/seller/order/cancel', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'review', label: '리뷰관리', count: statistics.reviewCount || 0, icon: <RateReviewIcon />, path: '/my/seller/order/review', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
    { id: 'inquiry', label: '문의관리', count: statistics.questionCount || 0, icon: <HelpOutlineIcon />, path: '/my/seller/order/inquiry', 
      activeColor: 'bg-yellow-100', defaultColor: 'bg-gray-100' },
  ];

  const getButtonStyle = (itemPath) => {
    const isActive = location.pathname === itemPath;
    return isActive ? 'bg-opacity-100 font-bold' : '';
  };

  const getButtonColor = (item) => {
    const isActive = location.pathname === item.path;
    return isActive ? item.activeColor : item.defaultColor;
  };

  // 현재 경로에 따라 적절한 컴포넌트 렌더링
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/my/seller/order') return <Order />;
    if (path === '/my/seller/order/new') return <New />;
    if (path === '/my/seller/order/exchange') return <Exchange />;
    if (path === '/my/seller/order/refund') return <Refund />;
    if (path === '/my/seller/order/cancel') return <Cancel />;
    if (path === '/my/seller/order/review') return <Review />;
    if (path === '/my/seller/order/inquiry') return <Question />;
    
    // 기본값
    return <Order />;
  };

  return (
    <DashboardLayout>
      <DashboardHeader title={"주문 관리"} />
      <div className='mt-4'>
        {loading ? (
            <div className="text-center py-4">데이터 로딩 중...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <div className='flex flex-nowrap gap-2 justify-between'>
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-2 py-2 rounded-md ${getButtonColor(item)} 
                              border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all ${getButtonStyle(item.path)}`}
                >
                  <span className="text-gray-700">{item.icon}</span>
                  <div className='flex flex-col'>
                    <span className="font-medium">{item.label}</span>
                    {item.count !== null && (
                      <span className="ml-1 text-sm font-semibold text-center">{item.count}건</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
      </div>
      
      {/* 동적으로 콘텐츠 표시 */}
      <div className='mt-4'>
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}

export default OrdermanageHome;