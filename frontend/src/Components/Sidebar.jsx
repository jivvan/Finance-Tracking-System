import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { NavLink, useLocation } from "react-router-dom";
import { HiChartBar, HiCurrencyDollar, HiUser, HiMenu } from "react-icons/hi";
import { MdAccountBalance } from "react-icons/md";
import { GoGoal } from "react-icons/go";

const SidebarComponent = ({ setSidebarCollapsed }) => {
  const { pathname } = useLocation();
  console.log(pathname);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setSidebarCollapsed(isCollapsed);
  };

  return (
    <Sidebar
      className={`fixed top-0 left-0 w-64 transition-all duration-300 ${
        isCollapsed ? "w-20" : ""
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col items-center w-full">
          <img src="/logo.png" alt="Logo" className="w-32" />
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none"
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </div>
      <hr className="my-4" />
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <NavLink
            to="/dashboard"
            className={() =>
              pathname === "/dashboard"
                ? "text-blue-600 sidebar-items"
                : "text-gray-700 sidebar-items"
            }
          >
            <HiChartBar className="inline-block mr-2" />
            {!isCollapsed && "Dashboard"}
          </NavLink>
          <NavLink
            to="/transactions"
            className={() =>
              pathname === "/transactions"
                ? "text-blue-600 sidebar-items"
                : "text-gray-700 sidebar-items"
            }
          >
            <HiCurrencyDollar className="inline-block mr-2" />
            {!isCollapsed && "Transactions"}
          </NavLink>
          <NavLink
            to="/accounts"
            className={() =>
              pathname === "/accounts"
                ? "text-blue-600 sidebar-items"
                : "text-gray-700 sidebar-items"
            }
          >
            <MdAccountBalance className="inline-block mr-2" />
            {!isCollapsed && "Accounts"}
          </NavLink>
          <NavLink
            to="/goals"
            className={() =>
              pathname === "/goals"
                ? "text-blue-600 sidebar-items"
                : "text-gray-700 sidebar-items"
            }
          >
            <GoGoal className="inline-block mr-2" />
            {!isCollapsed && "Goals"}
          </NavLink>
          <NavLink
            to="/profile"
            className={() =>
              pathname === "/profile"
                ? "text-blue-600 sidebar-items"
                : "text-gray-700 sidebar-items"
            }
          >
            <HiUser className="inline-block mr-2" />
            {!isCollapsed && "Profile"}
          </NavLink>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarComponent;
