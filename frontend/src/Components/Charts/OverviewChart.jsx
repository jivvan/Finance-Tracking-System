import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card } from "flowbite-react";
Chart.register(...registerables);

const OverviewChart = ({ dashSummary }) => {
  let overview = dashSummary.financial_overview;
  overview = [...overview].reverse();
  const data = {
    labels: overview.map((o) => o.month.split(" ")[0]),
    datasets: [
      {
        label: "Income",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: overview.map((o) => o.income),
      },
      {
        label: "Expenses",
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.6)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: overview.map((o) => -o.expense),
      },
    ],
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold dark:text-white">
        Financial Overview
      </h2>
      <Bar data={data} />
    </Card>
  );
};

export default OverviewChart;
