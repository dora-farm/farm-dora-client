import React from "react";
import { Bar } from "react-chartjs-2";

const SalesChart = ({ data }) => {
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

  return (
    <Bar data={data} options={barChartOptions} height={150} />
  );
};

export default SalesChart;