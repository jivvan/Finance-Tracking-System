import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, TextInput, Label } from "flowbite-react"; // Import Flowbite components
import { useStore } from "../lib/utils";

export default function AddGoalCard({ toggleAddGoalCard }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const addGoal = useStore((state) => state.addGoal);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !targetAmount) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/goals",
        {
          name,
          target_amount: targetAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      addGoal(response.data.goal);
      toast.success("Goal added successfully!");
      toggleAddGoalCard(); // Close the modal after successful submission
    } catch (e) {
      if (e.response && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={toggleAddGoalCard}
      ></div>
      <div className="relative p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 w-96">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add Goal
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="goalName" value="Goal Name" />
            <TextInput
              id="goalName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="targetAmount" value="Target Amount" />
            <TextInput
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button color="failure" type="button" onClick={toggleAddGoalCard}>
              Close
            </Button>
            <Button
              color="success"
              isProcessing={loading}
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
