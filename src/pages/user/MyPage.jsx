// MyPage.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { WishPreview } from "./components/WishPreview";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

function MyPage() {
  const userId = 1;

  const [dashboardData, setDashboardData] = useState({
    userInfoDTO: {
      name: " ",
      phone: " ",
      email: " ",
    },
    activityInfoDTO: {
      totalAmount: '0',
      reviewCount: 0,
      inquiryCount: 0,
    },
    orderStatus: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }
  });

  const loadDashboardInfo = async () => {
    try {
      const userResponse = await axios.get(
        `http://localhost:8080/api/my/user/dashboard/info`, 
        { params: { userId } }
      );

      const orderStatusResponse = await axios.get(
        `http://localhost:8080/api/my/user/dashboard/order-status`,
        { params: { userId } }
      );

      const orderStatusObj = {};
      orderStatusResponse.data.data.forEach(status => {
        orderStatusObj[status.statusId] = status.statusCount;
      });

        setDashboardData(prevData => ({
          ...prevData,
          userInfoDTO: userResponse.data.data.userInfoDTO,
          activityInfoDTO: userResponse.data.data.activityInfoDTO,
          orderStatus: {
            ...prevData.orderStatus,
            ...orderStatusObj
          }
        }));
    } catch (error) {
      console.error("유저 정보를 받아올 수 없습니다!:", error.message);
    }
  }

  useEffect(() => {
    loadDashboardInfo();
  }, []);

  return (
    <div className="w-full m-7">
      <div className="flex h-auto justify-center mx-8 mt-8 gap-4">
        <div className="flex flex-col w-[400px] bg-brown p-6 rounded-lg shadow-md select-none cursor-default">
          <span className="text-white text-xl font-bold border-b-2 border-white pb-3 mb-4">
            {dashboardData.userInfoDTO.name}님, 환영합니다.
          </span>
          <div className="flex flex-col text-white space-y-2 mt-2">
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">{dashboardData.userInfoDTO.phone}</span>
            </div>
            <div className="flex items-center">
              <EmailIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">{dashboardData.userInfoDTO.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[500px] bg-gray p-6 rounded-lg shadow-md select-none cursor-default">
          <div className="flex justify-between items-center border-b-2 pb-3 mb-4 border-brown">
            <span className="text-brown text-xl font-bold">총 구매금액</span>
            <span className="text-brown text-2xl font-bold">{dashboardData.activityInfoDTO.totalAmount.toLocaleString()} 원</span>
          </div>
          <div className="flex mt-3">
            <div className="flex flex-col items-center w-full">
              <span className="text-text-gray text-sm mb-1">리뷰</span>
              <Link to="/my/user/review" className="text-brown font-bold">{dashboardData.activityInfoDTO.reviewCount} 개</Link>
            </div>
            <div className="flex flex-col items-center w-full">
              <span className="text-text-gray text-sm mb-1">문의</span>
              <Link to="/my/user/inquiry" className="text-brown font-bold">{dashboardData.activityInfoDTO.inquiryCount} 개</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-12 mx-8 select-none cursor-default">
        <div className="flex justify-between items-end border-b-2 pb-2 border-gray-dark">
          <h2 className="font-bold text-2xl text-brown">나의 주문 현황</h2>
          <Link to="/my/user/order" className="text-text-gray text-xs font-bold hover:text-brown transition-colors">
            더보기＞
          </Link>
        </div>
        
        <div className="flex w-full justify-between mt-6 h-[180px] gap-4">
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <InventoryIcon className="h-8 w-8 text-brown" />
            </div>
            <span className="font-bold text-lg text-brown">배송 준비중</span>
            <span className="text-brown text-2xl font-bold mt-2">{dashboardData.orderStatus[1]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <LocalShippingIcon className="h-8 w-8 text-brown" />
            </div>
            <span className="font-bold text-lg text-brown">배송중</span>
            <span className="text-brown text-2xl font-bold mt-2">{dashboardData.orderStatus[2]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <DoneIcon className="h-8 w-8 text-brown" />
            </div>
            <span className="font-bold text-lg text-brown">배송완료</span>
            <span className="text-brown text-2xl font-bold mt-2">{dashboardData.orderStatus[3]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <CloseIcon className="h-8 w-8 text-brown" />
            </div>
            <span className="font-bold text-lg text-brown">취소</span>
            <span className="text-brown text-2xl font-bold mt-2">{dashboardData.orderStatus[4]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <SyncAltIcon className="h-8 w-8 text-brown" />
            </div>
            <span className="font-bold text-lg text-brown">반품 / 교환</span>
            <span className="text-brown text-2xl font-bold mt-2">{dashboardData.orderStatus[5]}</span>
          </div>
        </div>
      </div>
      <WishPreview userId={userId} />
    </div>
  );
}

export default MyPage;