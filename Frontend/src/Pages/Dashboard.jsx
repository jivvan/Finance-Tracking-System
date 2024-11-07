import React from "react";
import Sidebar from "../Components/Sidebar";
import Header1TEMP from "../Components/Header1TEMP";
import OverviewChart from "../Components/Charts/OverviewChart";
import ExpenseChart from "../Components/Charts/ExpenseChart";
import IncomeChart from "../Components/Charts/IncomeChart";
import RecentTransactions from "../Components/Charts/RecentTransactions";
import QuickCreate from "../Components/QuickCreate";

const Dashboard = () => {
  return (
    <>
      <Header1TEMP />
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto bg-gray-200">
            <QuickCreate />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <OverviewChart />
              <ExpenseChart />
              <IncomeChart />
            </div>
            <div className="mt-4">
              <RecentTransactions />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
