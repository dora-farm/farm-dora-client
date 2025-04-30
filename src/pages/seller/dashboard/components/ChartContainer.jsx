import React from "react";

const ChartContainer = ({ title, children, fullWidth = false }) => {
  return (
    <div className={`bg-gray-light border border-gray-dark rounded-md p-4 mb-6 ${fullWidth ? "" : ""}`}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;