import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useStore } from "../lib/utils";
import { Button } from "flowbite-react";

export default function AccountCard({ toggleAccountCard }) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const addAccount = useStore((state) => state.addAccount);
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
      console.log(response);
      addAccount(response.data.account);
      toast("Account created successfully");
      toggleAccountCard();
    } catch (e) {
      if (e.response.data.message) {
        toast(e.response.data.message);
      }
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
          <div className="flex flex-wrap gap-2">
            <Button color="failure" type="button" onClick={toggleAccountCard}>
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
