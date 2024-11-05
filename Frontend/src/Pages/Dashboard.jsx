import React, { useState } from "react";
import Header1TEMP from "../Components/Header1TEMP";

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

  const handleSubmit = (event, type) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Here you can make an API POST request with the data
    console.log(`Submitting ${type} data:`, data);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <header>
        <Header1TEMP />
      </header>
      <div className="flex justify-center items-center w-full py-5">
        <a href="#" onClick={toggleExpenseCard}>
          <p className="bg-red-500 rounded-full h-15 w-48 text-white text-center ml-5 py-2">
            + Add Expense
          </p>
        </a>
        <a href="#" onClick={toggleIncomeCard}>
          <p className="bg-green-500 rounded-full h-15 w-48 text-white text-center ml-5 py-2">
            + Add Income
          </p>
        </a>
        <a href="#" onClick={toggleAccountCard}>
          <p className="bg-yellow-400 rounded-full h-15 w-48 text-white text-center ml-5 py-2">
            + Add Account
          </p>
        </a>
      </div>
      {isExpenseCardVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleExpenseCard}></div>
          <div className="relative w-96 p-6 bg-white shadow-lg rounded">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <form onSubmit={(e) => handleSubmit(e, 'expense')}>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input type="number" name="amount" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea name="description" className="w-full px-3 py-2 border border-gray-300 rounded" />
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
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
      {isIncomeCardVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleIncomeCard}></div>
          <div className="relative w-96 p-6 bg-white shadow-lg rounded">
            <h2 className="text-xl font-bold mb-4">Add Income</h2>
            <form onSubmit={(e) => handleSubmit(e, 'income')}>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input type="number" name="amount" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea name="description" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={toggleIncomeCard}
              >
                Close
              </button>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
      {isAccountCardVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleAccountCard}></div>
          <div className="relative w-96 p-6 bg-white shadow-lg rounded">
            <h2 className="text-xl font-bold mb-4">Add Account</h2>
            <form onSubmit={(e) => handleSubmit(e, 'account')}>
              <div className="mb-4">
                <label className="block text-gray-700">Account Name</label>
                <input type="text" name="accountName" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Initial Balance</label>
                <input type="number" name="initialBalance" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={toggleAccountCard}
              >
                Close
              </button>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;