import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

function userLayout() {
  return (
    <div className="flex w-full">
      <UserSidebar />
      <Outlet />
    </div>
  );
}

export default userLayout;