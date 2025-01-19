import React, { useState } from "react";
import { Card, Table, Button, Modal, TextInput, Label } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import { useStore } from "../lib/utils";
import axios from "axios";
import { toast } from "react-toastify";

function Categories() {
  const categories = useStore((state) => state.categories);
  const setCategories = useStore((state) => state.setCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [limit, setLimit] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleEditLimitClick = (category) => {
    setSelectedCategory(category);
    setLimit(category.limit.toString());
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedCategory || !limit) return;

    const updatedCategory = {
      name: selectedCategory.name,
      limit: parseFloat(limit),
      category_type: selectedCategory.category_type,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/categories/${selectedCategory.id}`,
        updatedCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
        toast.success("Category limit updated successfully!");
        setCategories(
          categories.map((c) => {
            if (c.id === selectedCategory.id) {
              c.limit = updatedCategory.limit;
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error("Error updating category limit:", error);
      toast.error("Failed to update category limit. Please try again.");
    }
  };

  const expenseCategories = categories.filter(
    (cat) => cat.category_type === "expense"
  );
  const incomeCategories = categories.filter(
    (cat) => cat.category_type === "income"
  );

  return (
    <>
      <main className="p-4">
        <QuickCreate />
        <Card>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <h1 className="text-2xl font-bold dark:text-white">Categories</h1>
          </div>
        </Card>

        {/* Expense Table */}
        <div className="mt-6 overflow-x-auto">
          <h2 className="mb-4 text-xl font-semibold dark:text-white">
            Expense Categories
          </h2>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>SN</Table.HeadCell>
              <Table.HeadCell>Category Name</Table.HeadCell>
              <Table.HeadCell>Category Type</Table.HeadCell>
              <Table.HeadCell>Limit</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {expenseCategories.map((category, index) => (
                <Table.Row
                  key={category.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{category.name}</Table.Cell>
                  <Table.Cell>
                    {category.category_type === "expense"
                      ? "Expense"
                      : "Income"}
                  </Table.Cell>
                  <Table.Cell>{category.limit.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="blue"
                      size="xs"
                      onClick={() => handleEditLimitClick(category)}
                    >
                      Edit Limit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Income Table */}
        <div className="mt-6 overflow-x-auto">
          <h2 className="mb-4 text-xl font-semibold dark:text-white">
            Income Categories
          </h2>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>SN</Table.HeadCell>
              <Table.HeadCell>Category Name</Table.HeadCell>
              <Table.HeadCell>Category Type</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {incomeCategories.map((category, index) => (
                <Table.Row
                  key={category.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{category.name}</Table.Cell>
                  <Table.Cell>
                    {category.category_type === "income" ? "Income" : "Expense"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </main>

      {/* Edit Limit Modal */}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg dark:bg-gray-800 w-96">
            <h2 className="mb-4 text-xl font-bold dark:text-white">
              Edit Category Limit
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <TextInput
                    id="category-name"
                    value={selectedCategory?.name || ""}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="category-limit">Limit</Label>
                  <TextInput
                    id="category-limit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Enter new limit"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify">
                <Button color="failure" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button type="submit" color="blue">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Categories;
