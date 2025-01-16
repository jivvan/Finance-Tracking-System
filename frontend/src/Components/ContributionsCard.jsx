import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, Select, TextInput } from "flowbite-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useStore } from "../lib/utils";

const ContributionsCard = ({ goal, toggleContributionsCard }) => {
  const accounts = useStore((state) => state.accounts);
  const [contributions, setContributions] = useState([]);
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchContributions = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);

      try {
        const contributionsResponse = await axios.get(
          `${API_URL}/api/contributions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: { goal_id: goal.id },
          }
        );

        setContributions(contributionsResponse.data);
      } catch (error) {
        console.error("Error fetching accounts or contributions:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [API_URL, goal.id]);

  const handleAddContribution = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid contribution amount.");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      goal_id: goal.id,
      account_id: selectedAccount,
      amount: parseFloat(amount),
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/contributions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setAmount("");
        setSelectedAccount("");

        const updatedContributions = await axios.get(
          `${API_URL}/api/contributions`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { goal_id: goal.id }, // Make sure goal_id is passed correctly
          }
        );
        setContributions(updatedContributions.data);
        alert("Contribution added successfully!");
      } else {
        setError("Failed to add contribution. Please try again.");
      }
    } catch (error) {
      console.error("Error adding contribution:", error);
      setError("An error occurred while adding the contribution.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={toggleContributionsCard}
      ></div>
      <div className="relative p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl font-bold">
          Contribute to Goal: {goal.name}
        </h2>

        <div className="mb-4">
          <Label htmlFor="account">Select Account</Label>
          <Select
            id="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="amount">Amount</Label>
          <TextInput
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter contribution amount"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <Button
          onClick={handleAddContribution}
          className="text-white bg-green-500"
        >
          Add Contribution
        </Button>

        <div className="mt-6 overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Amount</TableHeadCell>
              <TableHeadCell>Account</TableHeadCell>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : contributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    No contributions yet.
                  </TableCell>
                </TableRow>
              ) : (
                contributions.map((contribution) => {
                  const accountName = accounts.find(
                    (account) => account.id === contribution.account_id
                  )?.name;

                  return (
                    <TableRow key={contribution.id}>
                      <TableCell>
                        {new Date(contribution.date).toLocaleString()}
                      </TableCell>
                      <TableCell>{contribution.amount}</TableCell>
                      <TableCell>{accountName || "Unknown Account"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <Button
          onClick={toggleContributionsCard}
          className="mt-4 text-white bg-red-500"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ContributionsCard;
