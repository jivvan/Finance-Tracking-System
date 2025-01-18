import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card } from "flowbite-react";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the datalabels plugin

// Register Chart.js core functionalities
Chart.register(...registerables);

// Define a larger color palette
const colorPalette = [
  "#4bc0c0",
  "#5eb5b9",
  "#73abb2",
  "#87a1ac",
  "#9b96a5",
  "#af8c9e",
  "#c38298",
  "#d77791",
  "#eb6d8a",
  "#ff6384",
];

// Function to get a color from the palette based on index
const getColor = (index) => {
  return colorPalette[index % colorPalette.length];
};

const ExpenseChart = ({ dashSummary }) => {
  const breakdown = dashSummary.expense_breakdown;
  let labels = Object.keys(breakdown);
  labels.sort((a, b) => breakdown[a] > breakdown[b]);
  const values = labels.map((l) => {
    return breakdown[l];
  });

  // Assign colors dynamically
  const backgroundColors = labels.map((_, index) => {
    const color = getColor(index);
    return `${color}cc`; // Add transparency (80 in hex = 50% opacity)
  });
  const hoverBackgroundColors = backgroundColors; // Use the same colors for hover

  const data = {
    labels: labels,
    datasets: [
      {
        data: values.map((v) => -v),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors,
        borderWidth: 0.5, // Remove the white border
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}`;
        },
        anchor: "center",
        align: "center",
        clamp: true,
      },
    },
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold dark:text-white">
        Expense Breakdown
      </h2>
      <div style={{ height: "400px", width: "100%" }}>
        {" "}
        <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </Card>
  );
};

export default ExpenseChart;
