import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header1TEMP from "../Components/Header1TEMP";
import OverviewChart from "../Components/Charts/OverviewChart";
import ExpenseChart from "../Components/Charts/ExpenseChart";
import IncomeChart from "../Components/Charts/IncomeChart";
import RecentTransactions from "../Components/Charts/RecentTransactions";
import QuickCreate from "../Components/QuickCreate";
import KeyMetrics from "../Components/Charts/KeyMetrics";
import SavingGoals from "../Components/Charts/SavingGoals";
import SpendingLimits from "../Components/Charts/SpendingLimits";
import ExpensePrediction from "../Components/Charts/ExpensePrediction";
import FinanceCalendar from "../Components/Charts/FinanceCalendar";
import { Select } from "flowbite-react";

const Dashboard = () => {
  const [currentAccount, setCurrentAccount] = useState("All accounts");
  const accountOptions = ["All accounts", "Cash", "Bank"];
  return (
    <>
      <div className="flex bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto">
            <QuickCreate />
            <div className="flex flex-col mb-4 w-max">
              <Select id="countries" required>
                {accountOptions.map((acc) => {
                  return <option>{acc}</option>;
                })}
              </Select>
            </div>
            <KeyMetrics />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <OverviewChart />
              <ExpenseChart />
              <IncomeChart />
            </div>
            <div className="mt-4">
              <RecentTransactions />
            </div>
            <hr className="mt-4 border border-gray-300 rounded-lg" />
            <div className="mt-4">
              <ExpensePrediction />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-2">
              <SavingGoals />
              <SpendingLimits />
            </div>
            <div className="mt-4">
              <FinanceCalendar />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
