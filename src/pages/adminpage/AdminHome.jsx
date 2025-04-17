import { useState, useEffect } from "react";
import DashboardHeader from "../seller/dashboard/components/DashboardHeader";
import DashboardLayout from "../seller/dashboard/components/DashboardLayout";
import PeriodSelector from "../seller/dashboard/components/PeriodSelector";
import ChartContainer from "../seller/dashboard/components/ChartContainer";
import SalesChart from "../seller/dashboard/components/SalesChart";
import useDashboardData from "../seller/dashboard/hooks/useDashboardData";

function AdminHome() {
  const [period, setPeriod] = useState("day");

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });

  const { adminSalesData, usersData, loadAdminAllData } = useDashboardData(
    null,
    startDate,
    endDate,
    period
  );

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);

    // 현재 날짜
    const now = new Date();
    let start = new Date();

    // 선택된 기간에 따라 시작일 설정
    switch (newPeriod) {
      case "day":
        start.setDate(now.getDate() - 7); // 일별 - 7일
        break;
      case "week":
        start.setDate(now.getDate() - 28); // 주별 - 4주
        break;
      case "month":
        start.setMonth(now.getMonth() - 6); // 월별 - 6개월
        break;
      default:
        start.setDate(now.getDate() - 7);
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(now.toISOString().split("T")[0]);
  };

  const handleSearch = () => {
    loadAdminAllData();
  };

  useEffect(() => {
    loadAdminAllData();
  }, []);

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
      <ChartContainer title="매출 현황">
        <SalesChart data={adminSalesData} />
      </ChartContainer>
      <ChartContainer title="가입자 현황">
        <SalesChart data={usersData} />
      </ChartContainer>
    </DashboardLayout>
  );
}

export default AdminHome;
