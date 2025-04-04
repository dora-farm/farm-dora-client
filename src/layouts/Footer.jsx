import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-100 pt-10 pb-6 mt-10">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* 고객센터 */}
          <div>
            <h3 className="font-bold text-lg mb-4">고객센터</h3>
            <p className="text-xl font-bold mb-2">1588-1234</p>
            <p className="text-sm text-gray-600 mb-4">평일 09:00 ~ 18:00 (주말 & 공휴일 제외)</p>
          </div>
          
          {/* 회사 정보 */}
          <div>
            <h3 className="font-bold text-lg mb-4">회사 정보</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>주소: 서울특별시 강남구 테헤란로 비트캠프</li>
              <li>대표이사: 이다훈</li>
              <li>사업자등록번호: 123-45-6789</li>
              <li>통신판매업신고번호: 제2025-비트캠프-1234호</li>
              <li>개인정보보호책임자: 이다훈</li>
            </ul>
          </div>
          
          {/* 서비스 링크 */}
          <div className="col-span-2">
            <h3 className="font-bold text-lg mb-4">서비스 안내</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <a href="#" className="text-gray-600">이용약관</a>
              <a href="#" className="font-bold">개인정보처리방침</a>
              <a href="#" className="text-gray-600">영상정보처리기기운영/관리방침</a>
              <a href="#" className="text-gray-600">공지사항</a>
              <a href="#" className="text-gray-600">임직원서비스</a>
              <a href="#" className="text-gray-600">매장안내</a>
              <a href="#" className="text-gray-600">사이트맵</a>
              <a href="#" className="text-gray-600">전자공고</a>
              <a href="#" className="text-gray-600">ESG 경영</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-6 text-sm text-gray-500">
          <p className="mb-2">
            네이버클라우드 파이널 프로젝트 2팀
          </p>
          <p>
            Copyright © Farmdora Corp. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;