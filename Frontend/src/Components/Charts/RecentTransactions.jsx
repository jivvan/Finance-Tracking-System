import React from "react";
import { Table } from "flowbite-react";

const RecentTransactions = () => {
  const transactions = [
    { date: "2023-10-01", description: "Groceries", amount: -50.0 },
    { date: "2023-10-02", description: "Salary", amount: 2000.0 },
    { date: "2023-10-03", description: "Rent", amount: -800.0 },
    { date: "2023-10-04", description: "Utilities", amount: -100.0 },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
      <Table>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {transactions.map((transaction, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {transaction.date}
              </Table.Cell>
              <Table.Cell>{transaction.description}</Table.Cell>
              <Table.Cell>{transaction.amount.toFixed(2)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RecentTransactions;
