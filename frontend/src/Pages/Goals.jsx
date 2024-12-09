import { useState } from "react";
import { Card, Button, Label, Select, TextInput } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import { GoGoal } from "react-icons/go";
import AddGoalCard from "../Components/AddGoalCard";

export default function Goals() {
  const [showAddGoalCard, setShowAddGoalCard] = useState(false);

  const toggleAddGoalCard = () => {
    setShowAddGoalCard(!showAddGoalCard);
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
      </main>
      {showAddGoalCard && <AddGoalCard toggleAddGoalCard={toggleAddGoalCard} />}
    </>
  );
}
