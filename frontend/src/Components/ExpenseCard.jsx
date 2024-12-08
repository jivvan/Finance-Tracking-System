import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ExpenseCard({ toggleExpenseCard }) {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

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
        setCategories(categoriesResponse.data);
      } catch (e) {
        toast.error("Failed to fetch data");
      }
    };

    fetchAccountsAndCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAccount || !amount || !description || !selectedCategory) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/transactions",
        {
          account_id: selectedAccount, // Send selected account ID
          amount:amount * -1,
          description,
          category_id: selectedCategory, // Send selected category ID
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Expense added successfully");
      toggleExpenseCard();
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={toggleExpenseCard}
      ></div>
      <div className="relative w-96 p-6 bg-white shadow-lg rounded">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
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
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={toggleExpenseCard}
          >
            Close
          </button>
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}
