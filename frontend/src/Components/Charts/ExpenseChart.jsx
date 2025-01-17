import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card } from "flowbite-react";
Chart.register(...registerables);

// Define a larger color palette
const colorPalette = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF8A80",
  "#A1887F",
  "#80DEEA",
  "#DCE775",
  "#FFAB91",
  "#81C784",
  "#64B5F6",
  "#F48FB1",
  "#CE93D8",
  "#9FA8DA",
  "#80CBC4",
  "#AED581",
  "#FFF176",
  "#FFB74D",
  "#FF7043",
  "#8D6E63",
  "#B0BEC5",
  "#4DB6AC",
  "#FFD54F",
  "#A5D6A7",
  "#E57373",
  "#BA68C8",
  "#7986CB",
  "#4DD0E1",
  "#FF8A65",
];

// Function to get a color from the palette based on index
const getColor = (index) => {
  return colorPalette[index % colorPalette.length];
};

const ExpenseChart = ({ dashSummary }) => {
  const breakdown = dashSummary.expense_breakdown;
  const labels = Object.keys(breakdown);
  const values = Object.values(breakdown);

  // Assign colors dynamically
  const backgroundColors = labels.map((_, index) => getColor(index));
  const hoverBackgroundColors = backgroundColors; // Use the same colors for hover

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors,
      },
    ],
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold dark:text-white">
        Expense Breakdown
      </h2>
      <Doughnut data={data} />
    </Card>
  );
};

export default ExpenseChart;
