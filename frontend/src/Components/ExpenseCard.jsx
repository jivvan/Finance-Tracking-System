import { useState, useEffect } from "react";
import {
  Button,
  ToggleSwitch,
  TextInput,
  Select,
  Textarea,
  Label,
} from "flowbite-react"; // Import Flowbite components
import axios from "axios";
import { toast } from "react-toastify";
import { useStore } from "../lib/utils";

export default function ExpenseCard({ refreshFn, toggleExpenseCard }) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [loading, setLoading] = useState(false);
  const [autoDetectCategory, setAutoDetectCategory] = useState(true); // Toggle state

  const updateAccountBalance = useStore((state) => state.updateAccountBalance);

  useEffect(() => {
    const fetchAccountsAndCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const accountsResponse = await axios.get(
          import.meta.env.VITE_API_URL + "/api/accounts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAccounts(accountsResponse.data);

        const categoriesResponse = await axios.get(
          import.meta.env.VITE_API_URL + "/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(
          categoriesResponse.data.filter((c) => c.category_type === "expense")
        );
      } catch (e) {
        toast.error("Failed to fetch data");
      }
    };

    fetchAccountsAndCategories();
  }, []);

  // Function to predict category based on description
  const predictCategory = async (description) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/transactions/predict_category",
        { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const predictedCategoryName = response.data.predicted_category;
      const predictedCategory = categories.find(
        (cat) => cat.name === predictedCategoryName
      );

      if (predictedCategory) {
        setSelectedCategory(predictedCategory.id); // Automatically select the predicted category
      }
    } catch (e) {
      console.error("Failed to predict category:", e);
    }
  };

  // Listen for changes in description when auto-detect is enabled
  useEffect(() => {
    if (autoDetectCategory && description) {
      const delayDebounceFn = setTimeout(() => {
        predictCategory(description);
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(delayDebounceFn);
    }
  }, [description, autoDetectCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedAccount ||
      !amount ||
      !description ||
      !selectedCategory ||
      !date
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Format the date as "YYYY-MM-DD HH:MM:SS"
      const formattedDate = `${date} 00:00:00`; // Append "00:00:00" for time

      const transaction = {
        account_id: parseInt(selectedAccount),
        amount: amount * -1,
        description,
        category_id: selectedCategory,
        date: formattedDate, // Use the formatted date
      };

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/transactions",
        transaction,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Expense added successfully");
      refreshFn();
      toggleExpenseCard();
      updateAccountBalance({
        id: transaction.account_id,
        amount: transaction.amount,
      });
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
        onClick={toggleExpenseCard}
      ></div>
      <div className="relative p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 w-96">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add Expense
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="amount" value="Amount" />
            <TextInput
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="account" value="Account" />
            <Select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
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
            <div className="flex items-center justify-between">
              <Label htmlFor="category" value="Category" />
              <ToggleSwitch
                sizing="sm"
                color="green"
                checked={autoDetectCategory}
                label="Auto-detect"
                onChange={() => setAutoDetectCategory(!autoDetectCategory)}
              />
            </div>
            <Select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="date" value="Date" />
            <TextInput
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button color="failure" type="button" onClick={toggleExpenseCard}>
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
