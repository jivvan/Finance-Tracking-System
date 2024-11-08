import React from "react";
import { Card } from "flowbite-react";

const ExpensePrediction = () => {
  const prediction = 2800.0;

  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold">30-Day Expense Prediction</h2>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        ${prediction.toFixed(2)}
      </p>
    </Card>
  );
};

export default ExpensePrediction;
