import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Label,
  Select,
  TextInput,
  Table,
  Modal,
} from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
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

export default function Transactions() {
  const transactions = useStore((state) => state.transactions);
  const setTransactions = useStore((state) => state.setTransactions);
  const updateDash = useStore((state) => state.updateDash);
  const accounts = useStore((state) => state.accounts);
  const categories = useStore((state) => state.categories);

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

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch transactions
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
      console.log("API Response:", response.data); // Debugging: Log API response
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, searchTerm]); // Re-fetch when currentPage or searchTerm changes

  // Function to handle page change
  const handlePageChange = (page) => {
    console.log("Changing to page:", page); // Debugging: Log page change
    setCurrentPage(page);
  };

  // Function to get account name by account_id
  const getAccountName = (accountId) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  // Function to get category name by category_id
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Function to handle Edit button click
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

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
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
        fetchTransactions(currentPage); // Refresh the transactions list
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction. Please try again.");
    }
  };

  // Function to handle Delete button click
  const handleDeleteClick = (transactionId) => {
    setTransactionToDelete(transactionId);
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  // Function to confirm deletion
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
        fetchTransactions(currentPage); // Refresh the transactions list
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction. Please try again.");
    } finally {
      setIsDeleteModalOpen(false); // Close the confirmation modal
      setTransactionToDelete(null); // Reset the transaction to delete
    }
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value); // Update search term state
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault(); // Prevent form submission
      fetchTransactions(1); // Reset to page 1 when searching
    };

    return (
      <>
        <ToastContainer /> {/* Add ToastContainer to display toasts */}
        <main className="p-4">
          <QuickCreate refreshFn={fetchTransactions} />
          <Card>
            <div className="flex flex-wrap items-center justify-between">
              <h1 className="text-2xl font-bold dark:text-white">
                Transactions
              </h1>
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
                            color="red"
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
          {/* Edit Modal */}
          <Modal
            show={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          >
            <Modal.Header>Edit Transaction</Modal.Header>
            <Modal.Body>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4">
                  <TextInput
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  <TextInput
                    name="amount"
                    label="Amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                  <Select
                    name="account_id"
                    label="Account"
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
                  <Select
                    name="category_id"
                    label="Category"
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
                <div className="flex justify-end mt-4">
                  <Button type="submit" color="blue">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            show={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            size="md"
          >
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <p className="text-lg text-gray-700">
                  Are you sure you want to delete this transaction?
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    color="gray"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button color="red" onClick={confirmDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>

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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
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
  };
}
