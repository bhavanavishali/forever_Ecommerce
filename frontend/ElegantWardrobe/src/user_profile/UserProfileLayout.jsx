import React from "react";
import { Outlet } from "react-router-dom";
import UserProfileSiderbar from "./UserProfileSiderbar";
import UserProfileNavbar from "./UserProfileNavbar";
import Navbar from "@/components/Navbar";

const UserProfileLayout = () => {
  return (
    <>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar />
      </div>
       <hr />
      <div className="flex">
        <div className="w-[20%]">
          <UserProfileSiderbar />
        </div>
        <div className="w-[80%] px-16 pt-10 pb-20">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default UserProfileLayout;
