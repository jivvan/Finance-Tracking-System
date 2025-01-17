import { useState } from "react";
import axios from "axios";
import { Card, Button, Label, Select, TextInput } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import ContributionsCard from "../Components/ContributionsCard";
import AddGoalCard from "../Components/AddGoalCard";
import { GoGoal } from "react-icons/go";
import { useStore } from "../lib/utils";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import default styles

export default function Goals() {
  const goals = useStore((state) => state.goals);
  const [showContributionsCard, setShowContributionsCard] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showAddGoalCard, setShowAddGoalCard] = useState(false);

  const toggleContributionsCard = (goal = null) => {
    setSelectedGoal(goal);
    setShowContributionsCard(!showContributionsCard);
  };

  const toggleAddGoalCard = () => {
    setShowAddGoalCard(!showAddGoalCard);
  };

  // Calculate progress percentage for each goal
  const calculateProgress = (currentAmount, targetAmount) => {
    if (targetAmount === 0) return 0; // Avoid division by zero
    return Math.round((currentAmount / targetAmount) * 100);
  };

  return (
    <>
      <main className="p-4">
        <QuickCreate />
        <Card>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <h1 className="text-2xl font-bold dark:text-gray-200">Goals</h1>
            <div>
              <Button onClick={toggleAddGoalCard} color="success">
                <GoGoal className="w-5 h-5 mr-2" />
                ADD GOAL
              </Button>
            </div>
          </div>
        </Card>
        <div className="mt-6 overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Goal Name</TableHeadCell>
              <TableHeadCell>Target Amount</TableHeadCell>
              <TableHeadCell>Current Amount</TableHeadCell>
              <TableHeadCell>Progress</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {goals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center">
                    No goals found.
                  </TableCell>
                </TableRow>
              ) : (
                goals.map((goal) => {
                  const progress = calculateProgress(
                    goal.current_amount,
                    goal.target_amount
                  );
                  return (
                    <TableRow
                      key={goal.id}
                      className="bg-white dark:bg-gray-800"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {goal.name}
                      </TableCell>
                      <TableCell>{goal.target_amount}</TableCell>
                      <TableCell>{goal.current_amount}</TableCell>
                      <TableCell>
                        <div style={{ width: "50px", height: "50px" }}>
                          <CircularProgressbar
                            value={progress}
                            text={`${progress}%`}
                            styles={{
                              path: {
                                stroke: "#3B82F6", // Blue color for the progress bar
                              },
                              text: {
                                fill: "#3B82F6", // Gray color for the text
                                fontSize: "24px",
                              },
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="xs"
                          color="success"
                          onClick={() => toggleContributionsCard(goal)}
                        >
                          Contribute
                        </Button>
                        <Button size="xs" color="blue">
                          Edit
                        </Button>
                        <Button size="xs" color="failure">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      {showAddGoalCard && <AddGoalCard toggleAddGoalCard={toggleAddGoalCard} />}
      {showContributionsCard && (
        <ContributionsCard
          toggleContributionsCard={toggleContributionsCard}
          goal={selectedGoal}
        />
      )}
    </>
  );
}
