import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex w-full">
      <AdminSidebar />
      <Outlet />
    </div>
  );
}

export default AdminLayout;