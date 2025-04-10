import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement,} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function SellerHome() {
  const barChartData = {
    labels: ["3/10", "3/11", "3/12", "3/13", "3/14", "3/15", "3/16"],
    datasets: [
      {
        label: "매출 (원)",
        data: [250000, 1100000, 950000, 500000, 750000, 380000, 450000],
        backgroundColor: "#494041",
        barThickness: 35,
        borderRadius: 3,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {display: false},
      legend: {display: false},
    },

    layout: {
      padding: {left: 1, top: 1, bottom: 5, right: 1}
    },

    scales: {
      x: {grid: {display: false}},
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, values) {
            if (value >= 1000) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return value;
          },
        },
      },
    },
  };

  const pieChartData1 = {
    labels: ["과일", "채소", "곡류"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#1CA673", "#F29B30", "#494041"],
        hoverBackgroundColor: ["#1CA673", "#F29B30", "#494041"],
      },
    ],
  };

  const pieChartData2 = {
    labels: ["정상", "반품", "교환"],
    datasets: [
      {
        data: [60, 10, 30],
        backgroundColor: ["#1CA673", "#D92B2B", "#F29B30"],
        hoverBackgroundColor: ["#1CA673", "#D92B2B", "#F29B30"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b-2">매출 현황</h1>

      <div className="flex flex-wrap items-center space-x-2 bg-gray-light border border-gray-dark rounded-md p-4 pl-6 mb-6">
        <span className="text-sm  min-w-[60px]">조회 기간:</span>
        <button className="px-2 py-1 bg-white text-sm rounded-md border whitesp min-w-[50px]">오늘</button>
        <button className="px-2 py-1 bg-gray-dark text-gray-light text-sm rounded-md border min-w-[50px]">1주일</button>
        <button className="px-2 py-1 bg-white text-sm rounded-md border min-w-[50px]">1개월</button>
        <button className="px-2 py-1 bg-white text-sm rounded-md border min-w-[50px]">3개월</button>
        <input type="date" className="px-2 py-1 text-sm border rounded-md" />
        <span>~</span>
        <input type="date" className="px-2 py-1 text-sm border rounded-md" />
        <button className="px-3 py-1 text-sm rounded-md bg-black text-white min-w-[50px]">조회</button>
      </div>

      <div className="flex items-center space-x-2 bg-gray-light border border-gray-dark rounded-md p-4 pl-6 mb-6">
        <Bar data={barChartData} options={barChartOptions} height={150} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-md mb-6">
        <div className="bg-gray-light rounded-md flex flex-col items-center border border-gray-dark">
          <h3 className="text-lg font-medium mb-4">제품별 매출 비율</h3>
          <div className="w-[80%] h-48 relative flex items-center justify-center">
            <Pie data={pieChartData1} options={pieChartOptions} />
          </div>
        </div>
        <div className="bg-gray-light rounded-md flex flex-col items-center border border-gray-dark">
          <h3 className="text-lg font-medium mb-4">반품 및 교환율</h3>
          <div className=" w-[80%] h-48 relative flex items-center justify-center">
            <Pie data={pieChartData2} options={pieChartOptions} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default SellerHome;
