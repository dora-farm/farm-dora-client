import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex w-full h-screen">
      <AdminSidebar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;