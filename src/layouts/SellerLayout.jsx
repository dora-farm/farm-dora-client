import { Outlet } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";

function SellerLayout() {
  return (
    <div className="flex w-full">
      <SellerSidebar />
      <Outlet />
    </div>
  );
}

export default SellerLayout;