import React from "react";
import { Card, Progress } from "flowbite-react";
import { getColorPerProgress } from "../../lib/utils";

const SavingGoals = () => {
  const goals = [
    { name: "Emergency Fund", target: 5000, current: 3000 },
    { name: "Vacation", target: 2000, current: 1500 },
    { name: "New Car", target: 10000, current: 4000 },
  ];

  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Saving Goals</h2>
      {goals.map((goal, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between mb-2">
            <span>{goal.name}</span>
            <span>
              ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
            </span>
          </div>
          <Progress
            progress={((goal.current / goal.target) * 100).toFixed(2)}
            size="lg"
            color={getColorPerProgress((goal.current / goal.target) * 100)}
            labelProgress
            progressLabelPosition="outside"
          />
        </div>
      ))}
    </Card>
  );
};

export default SavingGoals;
