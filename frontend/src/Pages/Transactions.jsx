import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Label,
  Select,
  TextInput,
  Table,
} from "flowbite-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuickCreate from "../Components/QuickCreate";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useStore } from "../lib/utils";

function Transactions() {
  const transactions = useStore((state) => state.transactions);
  const setTransactions = useStore((state) => state.setTransactions);
  const updateDash = useStore((state) => state.updateDash);
  const accounts = useStore((state) => state.accounts);
  const categories = useStore((state) => state.categories);
  const updateAccountBalance = useStore((state) => state.updateAccountBalance);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    has_next: false,
    has_prev: false,
    next_page: null,
    prev_page: null,
    total_items: 0,
  });

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    account_id: "",
    category_id: "",
  });

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

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
          search_term: searchTerm,
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
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getAccountName = (accountId) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      description: transaction.description,
      account_id: transaction.account_id,
      category_id: transaction.category_id,
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_URL}/api/transactions/${editingTransaction.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Transaction updated successfully!");
        setIsEditModalOpen(false);
        updateAccountBalance(
          {
            id: editingTransaction.account_id,
            amount: -editingTransaction.amount,
          },
          "self"
        );
        updateAccountBalance(
          {
            id: formData.account_id,
            amount: formData.amount,
          },
          "self"
        );
        updateDash();
        fetchTransactions(currentPage); // Refresh the transactions list
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction. Please try again.");
    }
  };

  const handleDeleteClick = (transactionId) => {
    setTransactionToDelete(parseInt(transactionId));
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${API_URL}/api/transactions/${transactionToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Transaction deleted successfully!");
        fetchTransactions(currentPage);
        const deletingTransaction = transactions.find(
          (t) => t.id === transactionToDelete
        );
        updateAccountBalance(
          {
            id: deletingTransaction.account_id,
            amount: -deletingTransaction.amount,
          },
          "self"
        );
        updateDash();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions(1);
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
              <TableHeadCell>Account</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {loading ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center">
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
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        transaction.amount < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      Rs.{" "}
                      {transaction.amount < 0
                        ? -transaction.amount
                        : transaction.amount}
                    </TableCell>
                    <TableCell>
                      {getAccountName(transaction.account_id)}
                    </TableCell>
                    <TableCell>
                      {getCategoryName(transaction.category_id)}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                          color="blue"
                          size="xs"
                          onClick={() => handleEditClick(transaction)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => handleDeleteClick(transaction.id)}
                        >
                          Delete
                        </Button>
                      </div>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg dark:bg-gray-800 w-96">
            <h2 className="mb-4 text-xl font-bold dark:text-white">
              Edit Transaction
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <TextInput
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <TextInput
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="account_id">Account</Label>
                  <Select
                    id="account_id"
                    name="account_id"
                    value={formData.account_id}
                    onChange={handleInputChange}
                    required
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  color="gray"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" color="blue">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg dark:bg-gray-800 w-96">
            <h2 className="mb-4 text-xl font-bold dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this transaction?
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                color="blue"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button color="failure" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Transactions;