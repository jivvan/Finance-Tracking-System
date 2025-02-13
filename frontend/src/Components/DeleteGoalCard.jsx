import React from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "../lib/utils";

export default function DeleteGoalCard({ goal, toggleDeleteGoalCard }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const goals = useStore((state) => state.goals);
  const setGoals = useStore((state) => state.setGoals);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${API_URL}/api/goals/${goal.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success("Goal deleted successfully!");
        setGoals(goals.filter((g) => g.id !== goal.id));
        toggleDeleteGoalCard(); // Close the modal
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg dark:bg-gray-800 w-96">
        <h2 className="mb-4 text-xl font-bold dark:text-white">
          Confirm Delete
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete the goal "{goal.name}"?
        </p>
        <div className="flex justify-end gap-4">
          <Button color="blue" onClick={toggleDeleteGoalCard}>
            Cancel
          </Button>
          <Button color="failure" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
