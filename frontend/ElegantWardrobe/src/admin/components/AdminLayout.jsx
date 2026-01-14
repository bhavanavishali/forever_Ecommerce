import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavbar />
      <hr />
      <div className="flex">
        <div className="w-[20%] border-r-2 ">
          <AdminSidebar />
        </div>
        <div className="w-[80%] px-16 pt-10 pb-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
