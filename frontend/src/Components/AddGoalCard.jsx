import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
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
      <div className="relative p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl font-bold">Add Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Goal Name</label>
            <input
              value={name}
              required
              type="text"
              name=""
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Target Amount</label>
            <input
              type="number"
              value={targetAmount}
              name=""
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) => setTargetAmount(e.target.value)}
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
