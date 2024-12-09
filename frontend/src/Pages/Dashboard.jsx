import React, { useEffect, useState } from "react";
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
import { Card, Select, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useStore } from "../lib/utils";

const Dashboard = () => {
  const [currentAccount, setCurrentAccount] = useState("All accounts");
  const accountOptions = ["All accounts", "Cash"];

  const dashSummary = useStore((state) => state.dashSummary);
  const setDashSummary = useStore((state) => state.setDashSummary);

  async function fetchSummary() {
    try {
      const token = localStorage.getItem("token");
      let url = import.meta.env.VITE_API_URL + "/dashboard";
      if (currentAccount != "All accounts") {
        url += "?account_id=" + 1; // TODO: use real account id
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashSummary(response.data);
    } catch (e) {
      toast.error("Failed to fetch data");
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <>
      {dashSummary.current_balance ? (
        <main className="p-4">
          <QuickCreate />
          <div className="flex flex-col mb-4 w-max">
            <Select id="countries" required>
              {accountOptions.map((acc) => {
                return <option>{acc}</option>;
              })}
            </Select>
          </div>
          <KeyMetrics dashSummary={dashSummary} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <OverviewChart dashSummary={dashSummary} />
            <ExpenseChart dashSummary={dashSummary} />
            <IncomeChart dashSummary={dashSummary} />
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
      ) : (
        <main className="p-4">
          <Card className="items-center">
            <Spinner aria-label="Loading Dashboard" />
          </Card>
        </main>
      )}
    </>
  );
};

export default Dashboard;
