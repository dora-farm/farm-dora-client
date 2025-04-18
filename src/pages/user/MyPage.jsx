import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function MyPage() {

  // const userId = 1;

  const [userInfo, setUserInfo] = useState({
    name: '박보검',
    phone: '010-4105-6739',
    email: 'user@example.com',
  });
  const [totalAmount] = useState('100,000,000');
  const [reviewCount] = useState(123);
  const [inquiryCount] = useState(456);
  const [orderStatus] = useState({
    1: 5,
    2: 3,
    3: 10,
    4: 2,
    5: 999,
  });
  // const [wishlist, setWishlist] = useState();

  const loadUserInfo = async () => {
    try {
      const userResponse = await axios.get(`http://localhost:8080/api/user/dashboard/info`);
      const userData = userResponse.data.data;
      setUserInfo(userData);
    } catch (error) {
      console.error("유저 정보를 받아올 수 없습니다!:", error.message);
    }
  }

  useEffect(() => {
    loadUserInfo();
  }, []);






  return (
    <div className="w-full m-7">

      <div className="flex h-auto justify-center mx-8 mt-8 gap-4">
        <div className="flex flex-col w-[400px] bg-brown p-6 rounded-lg shadow-md select-none cursor-default">
          <span className="text-white text-xl font-bold border-b-2 border-white pb-3 mb-4">{userInfo.name}님, 환영합니다.</span>
          <div className="flex flex-col text-white space-y-2 mt-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm">{userInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{userInfo.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[500px] bg-gray p-6 rounded-lg shadow-md select-none cursor-default">
          <div className="flex justify-between items-center border-b-2 pb-3 mb-4 border-brown">
            <span className="text-brown text-xl font-bold">총 구매금액</span>
            <span className="text-brown text-2xl font-bold">{totalAmount} 원</span>
          </div>
          <div className="flex mt-3">
            <div className="flex flex-col items-center w-full">
              <span className="text-text-gray text-sm mb-1">리뷰</span>
              <Link to="/my/user/review" className="text-brown font-bold">{reviewCount} 개</Link>
            </div>
            <div className="flex flex-col items-center w-full">
              <span className="text-text-gray text-sm mb-1">문의</span>
              <Link to="/my/user/inquiry" className="text-brown font-bold">{inquiryCount} 개</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-12 mx-8 select-none cursor-default">
        <div className="flex justify-between items-end border-b-2 pb-2 border-gray-dark">
          <h2 className="font-bold text-2xl text-brown">나의 주문 현황</h2>
          <Link to="/my/user/order" className="text-text-gray text-xs font-bold hover:text-brown transition-colors">더보기＞</Link>
        </div>
        
        <div className="flex w-full justify-between mt-6 h-[180px] gap-4">
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <span className="font-bold text-lg text-brown">배송 준비중</span>
            <span className="text-brown text-2xl font-bold mt-2">{orderStatus[1]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <span className="font-bold text-lg text-brown">배송중</span>
            <span className="text-brown text-2xl font-bold mt-2">{orderStatus[2]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-lg text-brown">배송완료</span>
            <span className="text-brown text-2xl font-bold mt-2">{orderStatus[3]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="font-bold text-lg text-brown">취소</span>
            <span className="text-brown text-2xl font-bold mt-2">{orderStatus[4]}</span>
          </div>
          
          <div className="w-full h-full border border-gray-dark rounded-lg shadow-md flex flex-col items-center justify-center bg-white hover:bg-gray transition-colors">
            <div className="w-16 h-16 bg-brown-light rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="font-bold text-lg text-brown">반품 / 교환</span>
            <span className="text-brown text-2xl font-bold mt-2">{orderStatus[5]}</span>
          </div>
          
        </div>
      </div>

      <div className="flex flex-col mt-12 mx-8 mb-8 select-none cursor-default">
        <div className="flex justify-between items-end border-b-2 pb-2 border-gray-dark">
          <h2 className="font-bold text-2xl text-brown">찜한 상품</h2>
          <Link to="/my/user/wishlist" className="text-text-gray text-xs font-bold hover:text-brown transition-colors">더보기＞</Link>
        </div>
        
        <div className="flex w-full justify-between mt-6 h-[200px] gap-4">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-text-gray">찜한 상품이 없습니다.</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MyPage;