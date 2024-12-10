import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AccountCard({ toggleAccountCard }) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/accounts",
        {
          name,
          balance,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(respnse);
      toast("Account created successfully");
    } catch (e) {
      if (e.response.data.message) {
        toast(e.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={toggleAccountCard}
      ></div>
      <div className="relative p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-xl font-bold">Add Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Account Name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
              type="text"
              name="accountName"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Initial Balance</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value);
              }}
              name="initialBalance"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 text-white bg-red-500 rounded"
            onClick={toggleAccountCard}
          >
            Close
          </button>
          <button
            disabled={loading}
            type="submit"
            className="px-4 py-2 ml-2 text-white bg-green-500 rounded disabled:bg-green-300"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
