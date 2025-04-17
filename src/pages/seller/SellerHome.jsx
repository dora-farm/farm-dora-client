import React, { useState, useEffect, use } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement,} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function SellerHome() {
  // 상태 관리
  const [salesData, setSalesData] = useState({
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

  const [statusRatio ,setStatusRatio] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#1CA673", "#D92B2B", "#F29B30", "#494041", "#8B5CDF", "#3C7BC9"],
        hoverBackgroundColor: ["#1CA673", "#D92B2B", "#F29B30", "#494041", "#8B5CDF", "#3C7BC9"],
      },
    ],
  });

  const [productRatio, setProductRatio] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#1CA673", "#D92B2B", "#F29B30", "#494041", "#8B5CDF", "#3C7BC9"],
        hoverBackgroundColor: ["#1CA673", "#D92B2B", "#F29B30", "#494041", "#8B5CDF", "#3C7BC9"],
      },
    ],
  });

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
  
  // 판매자 ID (실제로는 로그인 정보에서 가져와야 함)
  const sellerId = 1;

  // 데이터 로딩 함수
  const loadSalesData = async () => {
    try {
      const periodMapping = {
        'day': 'DAILY',
        'week': 'WEEKLY',
        'month': 'MONTHLY',
      };

      const serverPeriod = periodMapping[period];

      const response = await axios.get(`http://localhost:8080/api/my/seller/dashboard/sales`, {
        params: {
          sellerId,
          startDate,
          endDate,
          period: serverPeriod,
        }
      });
      
      const HttpResponse = response.data.data;

      // 데이터가 7개보다 많은 경우 가장 최근 데이터 7개만 사용
      let recentlyLabels = HttpResponse.labels;
      let recentlyData = HttpResponse.data;

      
      console.log("상태" + recentlyLabels);
      console.log("값" + recentlyData);
      
      if (recentlyLabels.length > 7) {
        // 가장 최근 데이터 7개만 추출 (배열의 마지막 7개 요소)
        recentlyLabels = recentlyLabels.slice(0, 7);
        recentlyData = recentlyData.slice(0, 7);
      }
      
      setSalesData({
        labels: recentlyLabels,
        datasets: [
          {
            label: "매출 (원)",
            data: recentlyData,
            backgroundColor: "#494041",
            barThickness: 35,
            borderRadius: 3,
          },
        ],
      });
    } catch (error) {
      console.error("매출 데이터 가져오기 실패:", error);
    }
  };

  const loadProductRatioData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/my/seller/dashboard/product`, {
        params: {sellerId}
      });
      
      const HttpResponse = response.data.data;

      let productLabels = HttpResponse.map(item => item.typename);
      let productPercentages = HttpResponse.map(item => item.percentage);

      console.log("상태" + productLabels);
      console.log("값" + productPercentages);

      const baseColors = ["#1CA673", "#D92B2B", "#F29B30", "#494041", "#8B5CDF", "#3C7BC9"];
      const backgroundColor = [];
      const hoverBackgroundColor = [];
      
      for (let i = 0; i < productPercentages.length; i++) {
        const colorIndex = i % baseColors.length;
        backgroundColor.push(baseColors[colorIndex]);
        hoverBackgroundColor.push(baseColors[colorIndex]);
      }

      setProductRatio({
        labels: productLabels,
        datasets: [
          {
            data: productPercentages,
            backgroundColor: backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor,
          },
        ],
      });

    } catch (error) {
      console.error("제품 비율 데이터 가져오기 실패:", error);
    }
  };

  const loadStatusRatioData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/my/seller/dashboard/status`, {
        params: {sellerId}
      });
      
      const HttpResponse = response.data.data;

      let statusLabels = HttpResponse.map(item => item.statusName);
      let statusPercentages = HttpResponse.map(item => item.percentage);

      console.log("상태" + statusLabels);
      console.log("값" + statusPercentages);

      const baseColors = ["#1CA673", "#D92B2B", "#F29B30", "#494041", "#8B5CDF", "#3C7BC9"];
      const backgroundColor = [];
      const hoverBackgroundColor = [];

      for (let i = 0; i < statusPercentages.length; i++) {
        const colorIndex = i % baseColors.length;
        backgroundColor.push(baseColors[colorIndex]);
        hoverBackgroundColor.push(baseColors[colorIndex]);
      }

      setStatusRatio({
        labels: statusLabels,
        datasets: [
          {
            data: statusPercentages,
            backgroundColor: backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor,
          },
        ],
      });

    } catch (error) {
      console.error("상태 비율 데이터 가져오기 실패:", error);
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadSalesData();
    loadProductRatioData();
    loadStatusRatioData();
  }, []);

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    loadSalesData();
    loadProductRatioData();
    loadStatusRatioData();
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

  useEffect(() => {
    // 기간 변경 시 데이터 로드
    loadSalesData();
  }, []);

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
          callback: function (value) {
            if (value >= 1000) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return value;
          },
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = value.toFixed(1);
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6 pb-2 border-b-2">대시보드</h1>

      <div className="flex flex-wrap items-center space-x-2 bg-gray-light border border-gray-dark rounded-md p-4 pl-6 mb-6">
        <span className="text-sm min-w-[60px]">조회 기간:</span>
        <button 
          className={`px-2 py-1 text-sm rounded-md border min-w-[50px] ${period === 'day' ? 'bg-gray-dark text-gray-light' : 'bg-white'}`}
          onClick={() => handlePeriodChange('day')}
        >
          일별
        </button>
        <button 
          className={`px-2 py-1 text-sm rounded-md border min-w-[50px] ${period === 'week' ? 'bg-gray-dark text-gray-light' : 'bg-white'}`}
          onClick={() => handlePeriodChange('week')}
        >
          주별
        </button>
        <button 
          className={`px-2 py-1 text-sm rounded-md border min-w-[50px] ${period === 'month' ? 'bg-gray-dark text-gray-light' : 'bg-white'}`}
          onClick={() => handlePeriodChange('month')}
        >
          월별
        </button>
        <input 
          type="date" 
          className="px-2 py-1 text-sm border rounded-md" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>~</span>
        <input 
          type="date" 
          className="px-2 py-1 text-sm border rounded-md" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button 
          className="px-3 py-1 text-sm rounded-md bg-black text-white min-w-[50px]"
          onClick={handleSearch}
        >
          조회
        </button>
      </div>

      <div className="flex flex-col items-center space-x-2 bg-gray-light border border-gray-dark rounded-md p-4 pl-6 mb-6">
        <h3 className="text-lg font-medium mb-4">매출 현황</h3>
        <Bar data={salesData} options={barChartOptions} height={150} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-md mb-6">
        <div className="bg-gray-light rounded-md flex flex-col items-center border border-gray-dark">
          <h3 className="text-lg font-medium mb-4">제품별 판매 비율</h3>
          <div className="w-[80%] h-48 relative flex items-center justify-center">
            <Pie data={productRatio} options={pieChartOptions} />
          </div>
        </div>
        <div className="bg-gray-light rounded-md flex flex-col items-center border border-gray-dark">
          <h3 className="text-lg font-medium mb-4">반품 및 교환율</h3>
          <div className="w-[80%] h-48 relative flex items-center justify-center">
            <Pie data={statusRatio} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerHome;