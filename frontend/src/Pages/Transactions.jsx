import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import QuickCreate from "../Components/QuickCreate";
import { Label, Select, TextInput, Card } from "flowbite-react";
import axios from "axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token"); // Assume you need a token for authorization
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

    fetchTransactions();
  }, []);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-4">
          <div>
            <QuickCreate />
          </div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">View Your Transactions</h1>
            <div className="flex items-center space-x-4">
              <TextInput
                id="search"
                type="text"
                placeholder="Search..."
                className="w-64"
              />
              <div className="flex items-center space-x-2">
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
          </div>

          <div className="mt-8 space-y-">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="max-w-3xl mx-auto p-4">
                  <div className="flex justify-between items-center">
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
              <p className="text-center text-gray-700">No transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;
