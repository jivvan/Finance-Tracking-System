import React from "react";
import { Link } from "react-router-dom";
import { Card, Progress, Badge } from "flowbite-react";
import { getColorPerProgress, useStore } from "../../lib/utils";

const SavingGoals = () => {
  const goals = useStore((state) => state.goals);
  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold dark:text-white">
        Saving Goals
      </h2>
      {goals.length > 0 ? (
        <>
          {goals.map((goal, index) => (
            <div key={index} className="mb-4 text-gray-800 dark:text-gray-200">
              <div className="flex justify-between mb-2 ">
                <span>{goal.name}</span>
                <span>
                  Rs. {goal.current_amount.toFixed(2)} / Rs.{" "}
                  {goal.target_amount.toFixed(2)}
                </span>
              </div>
              <Progress
                progress={(
                  (goal.current_amount / goal.target_amount) *
                  100
                ).toFixed(2)}
                size="lg"
                color={getColorPerProgress(
                  (goal.current_amount / goal.target_amount) * 100
                )}
                labelProgress
                progressLabelPosition="outside"
              />
            </div>
          ))}
          <Link className="flex" to="/goals">
            <Badge color="blue">View all</Badge>
          </Link>
        </>
      ) : (
        <p className="dark:text-gray-200">
          Create saving goals to see them here
        </p>
      )}
    </Card>
  );
};

export default SavingGoals;
