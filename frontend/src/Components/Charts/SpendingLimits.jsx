import React from "react";
import { Card, Progress } from "flowbite-react";
import { getColorPerProgress, useStore } from "../../lib/utils";

const SpendingLimits = ({ dashSummary }) => {
  const breakdown = dashSummary.expense_breakdown;
  const categories = useStore((state) => state.categories);
  const setCategories = categories.filter(
    (c) => c.category_type === "expense" && c.limit > 0
  );
  const limits = setCategories.map((cat) => ({
    name: cat.name,
    limit: cat.limit,
    spent: -breakdown[cat.name] || 0,
  }));
  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Spending Limits</h2>
      {limits.map((limit, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between mb-2">
            <span>{limit.name}</span>
            <span>
              Rs. {limit.spent.toFixed(2)} / Rs. {limit.limit.toFixed(2)}
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
