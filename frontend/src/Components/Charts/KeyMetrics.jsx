import React from "react";
import { Card } from "flowbite-react";
import { GiReceiveMoney, GiPayMoney, GiWallet } from "react-icons/gi";

const KeyNumericMetrics = ({ dashSummary }) => {
  const currentMetrics = {
    currentBalance: dashSummary.current_balance,
    monthlyExpense: dashSummary.past_30_day_expense,
    monthlyIncome: dashSummary.past_30_day_income,
  };

  const metrics = [
    {
      label: "Current Balance",
      current: currentMetrics.currentBalance,
    },
    {
      label: "Past 30 day Expense",
      current: currentMetrics.monthlyExpense,
    },
    {
      label: "Past 30 day Income",
      current: currentMetrics.monthlyIncome,
    },
  ];

  const formatValue = (value, label) => {
    if (label === "Past 30 day Expense") {
      return `Rs. ${-value.toFixed(2)}`;
    }
    return `Rs. ${value.toFixed(2)}`;
  };

  function renderSwitch(param) {
    switch (param) {
      case "Current Balance":
        return <GiWallet className="w-8 h-8 text-blue-500" />;
      case "Past 30 day Expense":
        return <GiPayMoney className="w-8 h-8 text-red-500" />;
      case "Past 30 day Income":
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
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KeyNumericMetrics;
