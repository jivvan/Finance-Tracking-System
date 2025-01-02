import React from "react";
import { Card } from "flowbite-react";
import { GiReceiveMoney, GiPayMoney, GiWallet } from "react-icons/gi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const KeyNumericMetrics = ({ dashSummary }) => {
  const currentMetrics = {
    currentBalance: dashSummary.current_balance,
    monthlyExpense: -dashSummary.this_month_expense,
    prevExpense: -dashSummary.last_month_expense,
    monthlyIncome: dashSummary.this_month_income,
    prevIncome: dashSummary.last_month_income,
  };

  // Function to calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0; // Avoid division by zero
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const metrics = [
    {
      label: "Current Balance",
      current: currentMetrics.currentBalance,
      previous: null, // No comparison for current balance
    },
    {
      label: "This month's Expense",
      current: currentMetrics.monthlyExpense,
      previous: currentMetrics.prevExpense,
    },
    {
      label: "This month's Income",
      current: currentMetrics.monthlyIncome,
      previous: currentMetrics.prevIncome,
    },
  ];

  const formatValue = (value, label) => {
    return `Rs. ${value.toFixed(2)}`;
  };

  const renderTrend = (current, previous, label) => {
    if (previous === null || previous === undefined) return null; // No trend for current balance

    const percentageChange = calculatePercentageChange(current, previous);
    let isPositive, trendText;

    // For expenses, a decrease is positive
    if (label === "This month's Expense") {
      isPositive = percentageChange <= 0;
      trendText = isPositive ? "Less than last month" : "More than last month";
    } else {
      // For income, an increase is positive
      isPositive = percentageChange >= 0;
      trendText = isPositive ? "More than last month" : "Less than last month";
    }

    return (
      <div className="flex items-center mt-1">
        <span
          className={`text-sm ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        </span>
        <span
          className={`text-sm ml-1 ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {Math.abs(percentageChange).toFixed(2)}% {trendText}
        </span>
      </div>
    );
  };

  function renderSwitch(param) {
    switch (param) {
      case "Current Balance":
        return <GiWallet className="w-8 h-8 text-blue-500" />;
      case "This month's Expense":
        return <GiPayMoney className="w-8 h-8 text-red-500" />;
      case "This month's Income":
        return <GiReceiveMoney className="w-8 h-8 text-green-500" />;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="flex flex-col p-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {metric.label}
            </h5>
            {renderSwitch(metric.label)}
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatValue(metric.current, metric.label)}
            </p>
            {renderTrend(metric.current, metric.previous, metric.label)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KeyNumericMetrics;
