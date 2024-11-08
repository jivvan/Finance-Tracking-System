import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const ExpenseChart = () => {
  const data = {
    labels: ["Housing", "Food", "Transportation", "Entertainment", "Other"],
    datasets: [
      {
        data: [300, 50, 100, 200, 150],
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
      <h2 className="mb-4 text-lg font-semibold">Expense Breakdown</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default ExpenseChart;
