import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card } from "flowbite-react";
Chart.register(...registerables);

const IncomeChart = ({ dashSummary }) => {
  let trend = dashSummary.financial_overview.map((o) => ({
    month: o.month.split(" ")[0],
    income: o.income,
  }));
  trend = [...trend].reverse();
  const data = {
    labels: trend.map((t) => t.month),
    datasets: [
      {
        label: "Income",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: trend.map((t) => t.income),
      },
    ],
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold dark:text-white">
        Income Trends
      </h2>
      <Line data={data} />
    </Card>
  );
};

export default IncomeChart;
