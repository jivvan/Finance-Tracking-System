import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { NavLink, useLocation } from "react-router-dom";
import { HiChartBar, HiCurrencyDollar, HiUser, HiMenu } from "react-icons/hi";
import { MdAccountBalance } from "react-icons/md";
import { GoGoal } from "react-icons/go";

const SidebarComponent = ({ setSidebarCollapsed }) => {
  const { pathname } = useLocation();
  const cleanPath = pathname.toLowerCase();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center w-full dark:invert">
          <img src="/logo.png" alt="Logo" className="w-32" />
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 dark:text-gray-400 focus:outline-none"
        >
          <HiMenu size={32} />
        </button>
      </div>
      <hr className="my-4" />
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <NavLink
            to="/dashboard"
            className={() =>
              (isCollapsed ? "flex items-center justify-center" : "") +
              (cleanPath === "/dashboard"
                ? " text-blue-600 sidebar-items"
                : " text-gray-700 dark:text-gray-300 sidebar-items")
            }
          >
            <HiChartBar size={24} className="inline-block" />
            {!isCollapsed && <p className="ml-2">Dashboard</p>}
          </NavLink>
          <NavLink
            to="/transactions"
            className={() =>
              (isCollapsed ? "flex items-center justify-center" : "") +
              (cleanPath === "/transactions"
                ? " text-blue-600 sidebar-items"
                : " text-gray-700 dark:text-gray-300 sidebar-items")
            }
          >
            <HiCurrencyDollar size={24} className="inline-block" />
            {!isCollapsed && <p className="ml-2">Transactions</p>}
          </NavLink>
          <NavLink
            to="/accounts"
            className={() =>
              (isCollapsed ? "flex items-center justify-center" : "") +
              (cleanPath === "/accounts"
                ? " text-blue-600 sidebar-items"
                : " text-gray-700 dark:text-gray-300 sidebar-items")
            }
          >
            <MdAccountBalance size={24} className="inline-block" />
            {!isCollapsed && <p className="ml-2">Accounts</p>}
          </NavLink>
          <NavLink
            to="/goals"
            className={() =>
              (isCollapsed ? "flex items-center justify-center" : "") +
              (cleanPath === "/goals"
                ? " text-blue-600 sidebar-items"
                : " text-gray-700 dark:text-gray-300 sidebar-items")
            }
          >
            <GoGoal size={24} className="inline-block" />
            {!isCollapsed && <p className="ml-2">Goals</p>}
          </NavLink>
          <NavLink
            to="/profile"
            className={() =>
              (isCollapsed ? "flex items-center justify-center" : "") +
              (cleanPath === "/profile"
                ? " text-blue-600 sidebar-items"
                : " text-gray-700 dark:text-gray-300 sidebar-items")
            }
          >
            <HiUser size={24} className="inline-block" />
            {!isCollapsed && <p className="ml-2">Profile</p>}
          </NavLink>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarComponent;
