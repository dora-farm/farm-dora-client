import React, { useState, useEffect } from "react";
import ChartContainer from "./components/ChartContainer";
import DashboardHeader from "./components/DashboardHeader";
import DashboardLayout from "./components/DashboardLayout";
import PeriodSelector from "./components/PeriodSelector";
import ProductRatioChart from "./components/ProductRatioChart";
import SalesChart from "./components/SalesChart";
import StatusRatioChart from "./components/StatusRatioChart";
import useDashboardData from "./hooks/useDashboardData";

function SellerHome() {
  
  const sellerId = 1;

  // 날짜 필터 상태
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  
  const [period, setPeriod] = useState('day'); // 'day', 'week', 'month'

  // 커스텀 훅을 통해 데이터 로직 분리
  const { 
    salesData, 
    productRatio, 
    statusRatio, 
    loadSellerAllData
  } = useDashboardData(sellerId, startDate, endDate, period);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadSellerAllData();
  }, []);

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    loadSellerAllData();
  };

  // 기간 버튼 핸들러
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    
    // 현재 날짜
    const now = new Date();
    let start = new Date();
    
    // 선택된 기간에 따라 시작일 설정
    switch(newPeriod) {
      case 'day':
        start.setDate(now.getDate() - 7); // 일별 - 7일
        break;
      case 'week':
        start.setDate(now.getDate() - 28); // 주별 - 4주
        break;
      case 'month':
        start.setMonth(now.getMonth() - 6); // 월별 - 6개월
        break;
      default:
        start.setDate(now.getDate() - 7);
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  };

  return (
    <DashboardLayout>
      <DashboardHeader title="대시보드" />
      
      <PeriodSelector 
        period={period}
        startDate={startDate}
        endDate={endDate}
        onPeriodChange={handlePeriodChange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={handleSearch}
      />

      <ChartContainer title="매출 현황" fullWidth={true}>
        <SalesChart data={salesData} />
      </ChartContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-md mb-6">
        <ChartContainer title="제품별 판매 비율">
          <ProductRatioChart data={productRatio} />
        </ChartContainer>
        
        <ChartContainer title="반품 및 교환율">
          <StatusRatioChart data={statusRatio} />
        </ChartContainer>
      </div>
    </DashboardLayout>
  );
}

export default SellerHome;