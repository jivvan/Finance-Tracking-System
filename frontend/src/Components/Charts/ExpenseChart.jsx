import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const ExpenseChart = ({ dashSummary }) => {
  const breakdown = dashSummary.expense_breakdown;
  const data = {
    labels: Object.keys(breakdown),
    datasets: [
      {
        data: Object.values(breakdown),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">
        Expense Breakdown
        <p className="text-sm font-normal text-gray-500">Last 30 days</p>
      </h2>
      <Doughnut data={data} />
    </div>
  );
};

export default ExpenseChart;
