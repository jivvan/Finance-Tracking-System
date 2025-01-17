import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import { useStore } from "../lib/utils";
import { MdAccountBalance, MdAccountBalanceWallet } from "react-icons/md";
import AccountCard from "../Components/AccountCard";
import axios from "axios";
import { toast } from "react-toastify";

function Accounts() {
  const accounts = useStore((state) => state.accounts);
  const deleteAccount = useStore((state) => state.deleteAccount);
  const updateDash = useStore((state) => state.updateDash);
  const [showAccountCard, setShowAccountCard] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const [loading, setLoading] = useState(false);

  const toggleAccountCard = (account = null) => {
    setSelectedAccount(account);
    setShowAccountCard(!showAccountCard);
  };

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    if (accountToDelete) {
      try {
        let response = await axios.delete(
          import.meta.env.VITE_API_URL + `/api/accounts/${accountToDelete.id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response);
        // Remove the account from the store or refresh the list
        setShowDeleteModal(false);
        deleteAccount(accountToDelete.id);
        updateDash();
        toast.success("Account deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete account.");
        console.error("Failed to delete account:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <main className="p-4">
        <QuickCreate />
        <Card>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <h1 className="text-2xl font-bold dark:text-white">Accounts</h1>
            <div>
              <Button onClick={() => toggleAccountCard()} color="success">
                <MdAccountBalanceWallet className="w-4 h-4 mr-3" />
                ADD ACCOUNT
              </Button>
            </div>
          </div>
        </Card>
        <Card className="mt-6">
          {accounts.length === 0 && (
            <h2 className="text-center">No accounts found</h2>
          )}
          <div className="flex flex-wrap justify-start gap-8 mt-8">
            {accounts.map((account, index) => (
              <Card
                key={index}
                className="flex flex-col items-center justify-center max-w-sm"
              >
                <div className="flex items-center justify-center mb-4 text-blue-500">
                  <MdAccountBalance size={64} />
                </div>
                <h5 className="text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
                  {account.name}
                </h5>
                <p className="font-normal text-center text-gray-700 dark:text-gray-400">
                  Balance: {account.balance}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    color="blue"
                    onClick={() => toggleAccountCard(account)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => handleDeleteClick(account)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </main>
      {showAccountCard && (
        <AccountCard
          toggleAccountCard={toggleAccountCard}
          account={selectedAccount}
        />
      )}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body className="dark:text-white">
          Are you sure you want to delete this account?
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            isProcessing={loading}
            disabled={loading}
            color="failure"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Accounts;
