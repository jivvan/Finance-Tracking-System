import React from "react";
import { Card } from "flowbite-react";
import { GiReceiveMoney, GiPayMoney, GiWallet } from "react-icons/gi";

const KeyNumericMetrics = () => {
  const currentMetrics = {
    currentBalance: 10000.0,
    monthlyExpense: 2500.0,
    monthlyIncome: 5000.0,
  };

  const previousMetrics = {
    currentBalance: 9500.0,
    monthlyExpense: 2300.0,
    monthlyIncome: 4500.0,
  };

  const metrics = [
    {
      label: "Current Balance",
      current: currentMetrics.currentBalance,
      previous: previousMetrics.currentBalance,
    },
    {
      label: "Past 30 day Expense",
      current: currentMetrics.monthlyExpense,
      previous: previousMetrics.monthlyExpense,
    },
    {
      label: "Past 30 day Income",
      current: currentMetrics.monthlyIncome,
      previous: previousMetrics.monthlyIncome,
    },
  ];

  const formatValue = (value) => {
    return `$${value.toFixed(2)}`;
  };

  const getDifference = (current, previous) => {
    const diff = current - previous;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${formatValue(diff)}`;
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
              {formatValue(metric.current)}
            </p>
            <p
              className={`text-sm ${
                metric.current >= metric.previous
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {getDifference(metric.current, metric.previous)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KeyNumericMetrics;
