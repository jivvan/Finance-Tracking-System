import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { useStore } from "../lib/utils";

export default function IncomeCard({ refreshFn, toggleIncomeCard }) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
          categoriesResponse.data.filter(
            (cat) => cat.category_type === "income"
          )
        );
      } catch (e) {
        toast.error("Failed to fetch data");
      }
    };

    fetchAccountsAndCategories();
  }, []);

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

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/transactions",
        {
          account_id: selectedAccount,
          amount,
          description,
          category_id: selectedCategory,
          date: formattedDate, // Include the formatted date
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Income added successfully");
      refreshFn();
      toggleIncomeCard();
      updateAccountBalance(
        {
          id: selectedAccount,
          amount: amount,
        },
        "self"
      );
    } catch (e) {
      console.log(e);
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
        onClick={toggleIncomeCard}
      ></div>
      <div className="relative p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl font-bold">Add Income</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Account</label>
            <select
              name="account"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button color="failure" type="button" onClick={toggleIncomeCard}>
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
