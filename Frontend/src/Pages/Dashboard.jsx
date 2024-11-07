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
    <div className="bg-gray-50 dark:bg-gray-900">
      <header>
        <Header1TEMP />
      </header>
      <div className="flex items-center justify-center w-full py-5">
        <a href="#" onClick={toggleExpenseCard}>
          <p className="w-48 py-2 ml-5 text-center text-white bg-red-500 rounded-full h-15">
            + Add Expense
          </p>
        </a>
        <a href="#" onClick={toggleIncomeCard}>
          <p className="w-48 py-2 ml-5 text-center text-white bg-green-500 rounded-full h-15">
            + Add Income
          </p>
        </a>
        <a href="#" onClick={toggleAccountCard}>
          <p className="w-48 py-2 ml-5 text-center text-white bg-yellow-400 rounded-full h-15">
            + Add Account
          </p>
        </a>
      </div>
    </>
  );
};

export default Dashboard;
