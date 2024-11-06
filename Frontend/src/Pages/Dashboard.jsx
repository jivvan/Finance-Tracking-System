import React, { useState } from "react";
import Header1TEMP from "../Components/Header1TEMP";
import ExpenseCard from "../Components/ExpenseCard";
import IncomeCard from "../Components/IncomeCard";
import AccountCard from "../Components/AccountCard";

function Dashboard() {
  const [isExpenseCardVisible, setIsExpenseCardVisible] = useState(false);
  const [isIncomeCardVisible, setIsIncomeCardVisible] = useState(false);
  const [isAccountCardVisible, setIsAccountCardVisible] = useState(false);

  const toggleExpenseCard = () => {
    setIsExpenseCardVisible(!isExpenseCardVisible);
  };

  const toggleIncomeCard = () => {
    setIsIncomeCardVisible(!isIncomeCardVisible);
  };

  const toggleAccountCard = () => {
    setIsAccountCardVisible(!isAccountCardVisible);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <header>
        <Header1TEMP />
      </header>
      <div className="flex items-center justify-center w-full py-5">
        <a href="#" onClick={toggleExpenseCard}>
          <p className="w-48 py-2 ml-5 text-center text-white bg-red-500 rounded-full h-15">
            + Add Expense
          </p>
        </a>
        <a href="#" onClick={toggleIncomeCard}>
          <p className="w-48 py-2 ml-5 text-center text-white bg-green-500 rounded-full h-15">
            + Add Income
          </p>
        </a>
        <a href="#" onClick={toggleAccountCard}>
          <p className="w-48 py-2 ml-5 text-center text-white bg-yellow-400 rounded-full h-15">
            + Add Account
          </p>
        </a>
      </div>
      {isExpenseCardVisible && (
        <ExpenseCard toggleExpenseCard={toggleExpenseCard} />
      )}
      {isIncomeCardVisible && (
        <IncomeCard toggleIncomeCard={toggleIncomeCard} />
      )}
      {isAccountCardVisible && (
        <AccountCard toggleAccountCard={toggleAccountCard} />
      )}
    </div>
  );
}

export default Dashboard;
