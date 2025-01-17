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
import EditGoalCard from "../Components/EditGoalCard"; // Import EditGoalCard
import DeleteGoalCard from "../Components/DeleteGoalCard"; // Import DeleteGoalCard

export default function Goals() {
  const goals = useStore((state) => state.goals);
  const [showContributionsCard, setShowContributionsCard] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const toggleContributionsCard = (goal = null) => {
    setSelectedGoal(goal);
    setShowContributionsCard(!showContributionsCard);
  };

  const [showAddGoalCard, setShowAddGoalCard] = useState(false);
  const toggleAddGoalCard = () => {
    setShowAddGoalCard(!showAddGoalCard);
  };

  const [showEditGoalCard, setShowEditGoalCard] = useState(false);
  const toggleEditGoalCard = (goal = null) => {
    setSelectedGoal(goal);
    setShowEditGoalCard(!showEditGoalCard);
  };

  const [showDeleteGoalCard, setShowDeleteGoalCard] = useState(false);
  const toggleDeleteGoalCard = (goal = null) => {
    setSelectedGoal(goal);
    setShowDeleteGoalCard(!showDeleteGoalCard);
  };

  const refreshGoals = async () => {
    // Fetch goals from the API and update the state
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/api/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      useStore.setState({ goals: response.data.goals });
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  return (
    <>
      <main className="p-4">
        <QuickCreate />
        <Card>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <h1 className="text-2xl font-bold">Goals</h1>
            <div>
              <Button
                onClick={toggleAddGoalCard}
                className="bg-green-600 border border-green-500 rounded-xl hover:bg-transparent hover:text-green-300"
              >
                <GoGoal className="w-5 h-5 mr-2" />
                ADD GOAL
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <TextInput
              id="search"
              type="text"
              placeholder="Search..."
              className="w-64"
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="sortby" className="text-gray-700">
                Sort by:
              </Label>
              <Select id="sortby" className="w-48">
                <option>Default</option>
                <option>A-Z</option>
                <option>Balance (lowest first)</option>
                <option>Balance (highest first)</option>
              </Select>
            </div>
          </div>
        </Card>
        <div className="mt-6 overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Goal Name</TableHeadCell>
              <TableHeadCell>Target Amount</TableHeadCell>
              <TableHeadCell>Current Amount</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {goals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="4" className="text-center">
                    No goals found.
                  </TableCell>
                </TableRow>
              ) : (
                goals.map((goal) => (
                  <TableRow key={goal.id} className="bg-white">
                    <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                      {goal.name}
                    </TableCell>
                    <TableCell>{goal.target_amount}</TableCell>
                    <TableCell>{goal.current_amount}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="xs"
                        className="text-white bg-blue-500"
                        onClick={(e) => {
                          toggleContributionsCard(goal);
                          e.currentTarget.blur(); // Remove focus from the button
                        }}
                      >
                        Contribute
                      </Button>
                      <Button
                        size="xs"
                        className="text-white bg-green-500"
                        onClick={(e) => {
                          toggleEditGoalCard(goal);
                          e.currentTarget.blur(); // Remove focus from the button
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        className="text-white bg-red-500"
                        onClick={(e) => {
                          toggleDeleteGoalCard(goal);
                          e.currentTarget.blur(); // Remove focus from the button
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Modals */}
      {showAddGoalCard && <AddGoalCard toggleAddGoalCard={toggleAddGoalCard} />}
      {showContributionsCard && (
        <ContributionsCard
          toggleContributionsCard={toggleContributionsCard}
          goal={selectedGoal}
        />
      )}
      {showEditGoalCard && selectedGoal && ( // Ensure selectedGoal is defined
        <EditGoalCard
          goal={selectedGoal}
          toggleEditGoalCard={toggleEditGoalCard}
          refreshGoals={refreshGoals}
        />
      )}
      {showDeleteGoalCard && selectedGoal && ( // Ensure selectedGoal is defined
        <DeleteGoalCard
          goal={selectedGoal}
          toggleDeleteGoalCard={toggleDeleteGoalCard}
          refreshGoals={refreshGoals}
        />
      )}
    </>
  );
}