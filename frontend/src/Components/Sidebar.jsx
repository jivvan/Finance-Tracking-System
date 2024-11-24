import React from "react";
import { Sidebar } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { HiChartBar, HiCurrencyDollar, HiUser } from "react-icons/hi";
import { MdAccountBalance } from "react-icons/md";

const SidebarComponent = () => {
  return (
    <Sidebar className="w-64 h-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-700"
              }
            >
              <HiChartBar className="inline-block mr-2" />
              Dashboard
            </NavLink>
          </Sidebar.Item>
          <Sidebar.Item>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-700"
              }
            >
              <HiCurrencyDollar className="inline-block mr-2" />
              Transactions
            </NavLink>
          </Sidebar.Item>
          <Sidebar.Item>
            <NavLink
              to="/accounts"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-700"
              }
            >
              <MdAccountBalance className="inline-block mr-2" />
              Accounts
            </NavLink>
          </Sidebar.Item>
          <Sidebar.Item>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-700"
              }
            >
              <HiUser className="inline-block mr-2" />
              Profile
            </NavLink>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarComponent;
