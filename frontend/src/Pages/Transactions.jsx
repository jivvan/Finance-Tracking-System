import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Label, Select, TextInput, Table } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useStore } from "../lib/utils";

export default function Transactions() {
  const transactions = useStore((state) => state.transactions);
  const setTransactions = useStore((state) => state.setTransactions);
  const updateDash = useStore((state) => state.updateDash);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [pagination, setPagination] = useState({
    has_next: false,
    has_prev: false,
    next_page: null,
    prev_page: null,
    total_items: 0,
  });

  function refreshFn() {
    fetchTransactions(1);
    updateDash();
  }

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTransactions = async (page = 1) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          search_term: searchTerm, // Include search term in the request
        },
      });
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, searchTerm]); // Re-fetch when currentPage or searchTerm changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term state
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    fetchTransactions(1); // Reset to page 1 when searching
  };

  return (
    <>
      <main className="p-4">
        <QuickCreate refreshFn={refreshFn} />
        <Card>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-2xl font-bold dark:text-white">Transactions</h1>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
            >
              <TextInput
                id="search"
                type="text"
                placeholder="Search..."
                className="w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button type="submit" color="blue">
                Search
              </Button>
            </form>
          </div>
        </Card>
        <div className="mt-6 overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Amount</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {loading ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="bg-white dark:bg-gray-800"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        transaction.amount < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      Rs. {transaction.amount}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-center mt-4">
          <nav className="flex gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_prev || loading}
              className="text-gray-700 bg-white hover:bg-gray-100"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next || loading}
              className="text-gray-700 bg-white hover:bg-gray-100"
            >
              Next
            </Button>
          </nav>
        </div>
      </main>
    </>
  );
}
