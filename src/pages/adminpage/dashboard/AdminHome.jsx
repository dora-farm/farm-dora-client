import { useState } from 'react'
import DashboardHeader from "../../seller/dashboard/components/DashboardHeader";
import DashboardLayout from "../../seller/dashboard/components/DashboardLayout";
import PeriodSelector from "../../seller/dashboard/components/PeriodSelector";
import ChartContainer from "../../seller/dashboard/components/ChartContainer";
import SalesChart from "../../seller/dashboard/components/SalesChart";

function AdminHome() {

  const [salesData] = useState({
    labels: [],
    datasets: [
      {
        label: "매출 (원)",
        data: [],
        backgroundColor: "#494041",
        barThickness: 35,
        borderRadius: 3,
      },
    ],
  });

  const [usersData] = useState({
    labels: [],
    datasets: [
      {
        label: "가입자 수",
        data: [],
        backgroundColor: "#494041",
        barThickness: 35,
        borderRadius: 3,
      },
    ],
  });



  return (
    <DashboardLayout>
      <DashboardHeader title="대시보드" />
      <PeriodSelector/>
      <ChartContainer title="매출 현황">
        <SalesChart data={salesData} />
      </ChartContainer>
      <ChartContainer title="가입자 수">
        <SalesChart data={usersData}/>
      </ChartContainer>

    </DashboardLayout>
  )
}

export default AdminHome