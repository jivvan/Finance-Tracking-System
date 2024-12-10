import React, { useEffect, useState } from "react";
import QuickCreate from "../Components/QuickCreate";
import { Label, Select, TextInput, Card } from "flowbite-react";
import axios from "axios";
import { useStore } from "../lib/utils";

function Transactions() {
  const transactions = useStore((state) => state.transactions);
  const setTransactions = useStore((state) => state.setTransactions);

  const [tried, setTried] = useState(false);
  //   const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (transactions.length === 0 && !tried) {
      fetchTransactions();
      setTried(true);
    }
  }, []);

  return (
    <>
      <main className="p-4">
        <QuickCreate />
        <Card>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <TextInput
              id="search"
              type="text"
              placeholder="Search..."
              className="w-64"
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="sortby" className="text-gray-700">
                Sort by:
              </Label>
              <Select id="sortby" className="w-48">
                <option>Default</option>
                <option>A-Z</option>
                <option>Balance (lowest first)</option>
                <option>Balance (highest first)</option>
              </Select>
            </div>
          </div>

          <div className="mt-8 space-y-">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="max-w-3xl p-4 mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xl font-bold text-gray-900">
                        {transaction.description}
                      </h5>
                      <p className="text-gray-700">
                        Amount: Rs.{transaction.amount}
                      </p>
                      <p className="text-gray-500">
                        Date: {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-700">
                No transactions found.
              </p>
            )}
          </div>
        </Card>
      </main>
    </>
  );
}

export default Transactions;
