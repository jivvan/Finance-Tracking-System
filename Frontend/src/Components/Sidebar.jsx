import React from "react";
import { Sidebar } from "flowbite-react";
import { HiChartBar, HiCurrencyDollar, HiUser } from "react-icons/hi";
import { MdAccountBalance } from "react-icons/md";

const SidebarComponent = () => {
  return (
    <Sidebar aria-label="Default sidebar example" className="w-64">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartBar}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiCurrencyDollar}>
            Transactions
          </Sidebar.Item>
          <Sidebar.Item href="/accounts" icon={MdAccountBalance}>
            Accounts
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Profile
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarComponent;
