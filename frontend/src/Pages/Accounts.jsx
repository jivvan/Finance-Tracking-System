import React, { useEffect, useState } from "react";
import { Card, Button, Label, Select, TextInput } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import { useStore } from "../lib/utils";
import { MdAccountBalanceWallet } from "react-icons/md";
import AccountCard from "../Components/AccountCard";

function Accounts() {
  const accounts = useStore((state) => state.accounts);
  const [showAccountCard, setShowAccountCard] = useState(false);
  const toggleAccountCard = () => {
    setShowAccountCard(!showAccountCard);
  };

  return (
    <>
      <main className="p-4">
        <QuickCreate />
        <Card>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <h1 className="text-2xl font-bold">Accounts</h1>
            <div>
              <Button
                onClick={toggleAccountCard}
               className="bg-green-600 border border-green-500 rounded-xl hover:bg-transparent hover:text-green-300">
                <MdAccountBalanceWallet className="w-4 h-4 mr-3" />
                ADD ACCOUNT
                </Button>
            </div>
          </div>
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

          <div className="flex flex-wrap justify-start gap-8 mt-8">
            {accounts.map((account, index) => (
              <Card
                key={index}
                className="flex flex-col items-center justify-center max-w-sm"
              >
                <div className="flex items-center justify-center mb-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6020/6020687.png" // Placeholder profile image
                    alt="Profile"
                    className="object-cover w-24 h-24 border border-gray-300 rounded-full"
                  />
                </div>
                <h5 className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
                  {account.name}
                </h5>
                <p className="font-normal text-center text-gray-700 dark:text-gray-400">
                  Balance: {account.balance}
                </p>
                <Button
                  color="blue"
                  className="mt-4 text-white bg-blue-500 hover:bg-blue-700"
                >
                  View Details
                  <svg
                    className="w-4 h-4 ml-2 -mr-1 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </main>
      {showAccountCard && <AccountCard toggleAccountCard={toggleAccountCard} />}
    </>
  );
}

export default Accounts;
