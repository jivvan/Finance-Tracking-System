import React from "react";
import { Table } from "flowbite-react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const RecentTransactions = ({ dashSummary }) => {
  const transactions = dashSummary.recent_transactions;

  const formatAmount = (amount) => {
    const isPositive = amount > 0;
    return (
      <span
        className={`flex items-center space-x-2 font-semibold ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <FaArrowUp className="w-5 h-5" />
        ) : (
          <FaArrowDown className="w-5 h-5" />
        )}
        <span>{`Rs. ${Math.abs(amount).toFixed(2)}`}</span>
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Recent Transactions
      </h2>
      <Table>
        <Table.Head>
          <Table.HeadCell className="text-gray-600">Date</Table.HeadCell>
          <Table.HeadCell className="text-gray-600">Description</Table.HeadCell>
          {/* <Table.HeadCell className="text-gray-600">Category</Table.HeadCell> */}
          <Table.HeadCell className="text-gray-600">Amount</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {transactions.map((transaction, index) => (
            <Table.Row
              key={index}
              className="h-12 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {transaction.date}
              </Table.Cell>
              <Table.Cell className="text-gray-700 dark:text-gray-300">
                {transaction.description}
              </Table.Cell>
              {/* <Table.Cell className="text-gray-700 dark:text-gray-300">
                {transaction.category_id}
              </Table.Cell> */}
              <Table.Cell>{formatAmount(transaction.amount)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RecentTransactions;
