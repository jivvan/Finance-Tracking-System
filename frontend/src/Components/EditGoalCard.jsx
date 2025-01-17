import React, { useState } from "react";
import { Button, TextInput, Label } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditGoalCard({
  goal,
  toggleEditGoalCard,
  refreshGoals,
}) {
  // Ensure goal is defined before accessing its properties
  if (!goal) {
    return null; // Return null or a loading state if goal is undefined
  }

  const [formData, setFormData] = useState({
    name: goal.name,
    target_amount: goal.target_amount,
    current_amount: goal.current_amount,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_URL}/api/goals/${goal.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Goal updated successfully!");
        refreshGoals(); // Refresh the goals list
        toggleEditGoalCard(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg dark:bg-gray-800 w-96">
        <h2 className="mb-4 text-xl font-bold dark:text-white">Edit Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Goal Name</Label>
              <TextInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="target_amount">Target Amount</Label>
              <TextInput
                id="target_amount"
                name="target_amount"
                type="number"
                value={formData.target_amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="current_amount">Current Amount</Label>
              <TextInput
                id="current_amount"
                name="current_amount"
                type="number"
                value={formData.current_amount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button color="gray" onClick={toggleEditGoalCard}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
