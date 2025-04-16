import { useState } from "react";
import axios from "axios";

const useDashboardData = (sellerId, startDate, endDate, period) => {
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

  const [statusRatio, setStatusRatio] = useState({
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
  };

  // 모든 데이터를 로드하는 함수
  const loadAllData = () => {
    loadSalesData();
    loadProductRatioData();
    loadStatusRatioData();
  };

  return {
    salesData,
    productRatio,
    statusRatio,
    loadSalesData,
    loadProductRatioData,
    loadStatusRatioData,
    loadAllData
  };
};

export default useDashboardData;