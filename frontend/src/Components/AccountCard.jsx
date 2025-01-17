import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useStore } from "../lib/utils";
import { Button, TextInput, Label } from "flowbite-react"; // Import Flowbite components

export default function AccountCard({ refreshFn, toggleAccountCard, account }) {
  const [name, setName] = useState(account ? account.name : "");
  const [balance, setBalance] = useState(account ? account.balance : 0);
  const [loading, setLoading] = useState(false);
  const addAccount = useStore((state) => state.addAccount);
  const updateAccount = useStore((state) => state.updateAccount);
  const updateDash = useStore((state) => state.updateDash);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(account.balance);
    }
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (account) {
        // Update existing account
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/accounts/${account.id}`,
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
        updateAccount({ id: account.id, name: name, balance: balance });
        updateDash();
        toast.success("Account updated successfully");
      } else {
        // Add new account
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/accounts`,
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
        addAccount(response.data.account);
        toast("Account created successfully");
      }
      toggleAccountCard();
      updateDash();
      refreshFn();
    } catch (e) {
      if (e.response && e.response.data.message) {
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
      <div className="relative p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 w-96">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {account ? "Edit Account" : "Add Account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="accountName" value="Account Name" />
            <TextInput
              id="accountName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="initialBalance"
              value={account ? "Balance" : "Initial Balance"}
            />
            <TextInput
              id="initialBalance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
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
              {loading
                ? account
                  ? "Updating..."
                  : "Adding..."
                : account
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
