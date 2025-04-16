import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {children}
    </div>
  );
};

export default DashboardLayout;