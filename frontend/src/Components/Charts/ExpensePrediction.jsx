import React from "react";
import { Card } from "flowbite-react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns"; // Import the date adapter

Chart.register(...registerables);

const ExpensePrediction = ({ dashSummary }) => {
  const predictions = dashSummary.prediction;

  if (predictions.message) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Expense Prediction</h2>
        There aren't enough expenses to make a prediction
      </Card>
    );
  }

  // Prepare data for Chart.js
  const historicalDates = Object.keys(predictions.historical);
  const historicalValues = Object.values(predictions.historical).map((v) => -v);
  const forecastDates = Object.keys(predictions.forecast);
  const forecastValues = Object.values(predictions.forecast).map((v) =>
    v > 0 ? 0.1 : -v
  );

  // Combine and sort dates
  const allDates = [...historicalDates, ...forecastDates].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Create a map for quick lookup
  const historicalMap = new Map(
    historicalDates.map((date, index) => [date, historicalValues[index]])
  );
  const forecastMap = new Map(
    forecastDates.map((date, index) => [date, forecastValues[index]])
  );

  // Prepare data arrays
  const historicalData = allDates.map(
    (date) => historicalMap.get(date) || null
  );
  const forecastData = allDates.map((date) => forecastMap.get(date) || null);

  const data = {
    labels: allDates,
    datasets: [
      {
        label: "Historical Expenses",
        data: historicalData,
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
      {
        label: "Forecasted Expenses",
        data: forecastData,
        borderColor: "rgba(192,75,192,1)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold">Expense Prediction</h2>
      <div className="w-full h-96">
        <Line data={data} options={options} />
      </div>
      <p className="text-xs text-gray-500 ">
        *Only past 30 days data is considered
      </p>
    </Card>
  );
};

export default ExpensePrediction;
