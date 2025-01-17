import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, Select, TextInput, Table } from "flowbite-react"; // Import Flowbite components
import { useStore } from "../lib/utils";
import { toast } from "react-toastify";

const ContributionsCard = ({ goal, toggleContributionsCard }) => {
  const accounts = useStore((state) => state.accounts);
  const updateDash = useStore((state) => state.updateDash);
  const updateAccountBalance = useStore((state) => state.updateAccountBalance);
  const updateGoalStatus = useStore((state) => state.updateGoalStatus);
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
    setError("");
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
    setLoading(true);
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

      if (response.status === 201) {
        const updatedContributions = await axios.get(
          `${API_URL}/api/contributions`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { goal_id: goal.id }, // Make sure goal_id is passed correctly
          }
        );
        setContributions(updatedContributions.data);
        updateDash();
        const accId = parseInt(selectedAccount);
        updateAccountBalance(
          { id: accId, amount: -1 * payload.amount },
          "self"
        );
        updateGoalStatus({ id: goal.id, amount: payload.amount });
        toast.success("Contribution added successfully!");
        setAmount("");
        setSelectedAccount("");
      } else {
        setError("Failed to add contribution. Please try again.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while adding the contribution.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={toggleContributionsCard}
      ></div>
      <div className="relative p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 w-96">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Contribute to Goal: {goal.name}
        </h2>

        <div className="mb-4">
          <Label htmlFor="account" value="Select Account" />
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
          <Label htmlFor="amount" value="Amount" />
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
          isProcessing={loading}
          disabled={loading}
          color="success"
          className="w-full"
        >
          Add Contribution
        </Button>

        <div className="mt-6 overflow-x-auto max-h-96">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Account</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan="3" className="text-center">
                    Loading...
                  </Table.Cell>
                </Table.Row>
              ) : contributions.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan="3" className="text-center">
                    No contributions yet.
                  </Table.Cell>
                </Table.Row>
              ) : (
                contributions.map((contribution) => {
                  const accountName = accounts.find(
                    (account) => account.id === contribution.account_id
                  )?.name;

                  return (
                    <Table.Row key={contribution.id}>
                      <Table.Cell>
                        {new Date(contribution.date).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>{contribution.amount}</Table.Cell>
                      <Table.Cell>
                        {accountName || "Unknown Account"}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table>
        </div>

        <Button
          onClick={toggleContributionsCard}
          color="failure"
          className="w-full mt-4"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ContributionsCard;
