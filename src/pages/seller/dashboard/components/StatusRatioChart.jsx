import React from "react";
import { Pie } from "react-chartjs-2";

const StatusRatioChart = ({ data }) => {
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
    <div className="w-[80%] h-48 relative flex items-center justify-center">
      <Pie data={data} options={pieChartOptions} />
    </div>
  );
};

export default StatusRatioChart;