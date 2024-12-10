import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Label, Select, TextInput } from "flowbite-react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import AddGoalCard from "../Components/AddGoalCard";
import { GoGoal } from "react-icons/go";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoalCard, setShowAddGoalCard] = useState(false);

  const toggleAddGoalCard = () => {
    setShowAddGoalCard(!showAddGoalCard);
  };

  // Fetch goals from the API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/goals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGoals(response.data); // Assuming the API returns an array of goals
        setLoading(false);
      } catch (error) {
        console.error("Error fetching goals:", error);
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

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

        {/* Goals Table */}
        <div className="overflow-x-auto mt-4">
          <Card>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>Goal Name</TableHeadCell>
                  <TableHeadCell>Target Amount</TableHeadCell>
                  <TableHeadCell>Current Amount</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Actions</span>
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {goals.map((goal) => (
                    <TableRow
                      key={goal.id}
                      className="bg-white dark:border-gray-700"
                    >
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {goal.name}
                      </TableCell>
                      <TableCell>{goal.target_amount}</TableCell>
                      <TableCell>{goal.current_amount || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            className="bg-blue-500 hover:bg-blue-700 text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            className="bg-red-500 hover:bg-red-700 text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </main>

      {/* Add Goal Card */}
      {showAddGoalCard && <AddGoalCard toggleAddGoalCard={toggleAddGoalCard} />}
    </>
  );
}
