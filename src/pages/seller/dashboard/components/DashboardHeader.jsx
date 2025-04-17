import React from "react";

const DashboardHeader = ({ title }) => {
  return (
    <h1 className="text-2xl font-semibold mb-6 pb-2 border-b-2">{title}</h1>
  );
};

export default DashboardHeader;