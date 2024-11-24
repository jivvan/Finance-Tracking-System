import React from "react";
import { Card, Progress } from "flowbite-react";
import { getColorPerProgress } from "../../lib/utils";

const SpendingLimits = () => {
  const limits = [
    { category: "Groceries", limit: 500, spent: 450 },
    { category: "Entertainment", limit: 300, spent: 200 },
    { category: "Utilities", limit: 200, spent: 180 },
  ];

  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Spending Limits</h2>
      {limits.map((limit, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between mb-2">
            <span>{limit.category}</span>
            <span>
              ${limit.spent.toFixed(2)} / ${limit.limit.toFixed(2)}
            </span>
          </div>
          <Progress
            progress={((limit.spent / limit.limit) * 100).toFixed(2)}
            color={getColorPerProgress((limit.spent / limit.limit) * 100, true)}
            size="lg"
            labelProgress
            progressLabelPosition="outside"
          />
        </div>
      ))}
    </Card>
  );
};

export default SpendingLimits;
