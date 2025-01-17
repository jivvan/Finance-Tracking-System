import React, { useState } from "react";
import { Card, Table, Button, Modal, TextInput, Label } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import { useStore } from "../lib/utils";
import axios from "axios";
import { toast } from "react-toastify";

function Categories() {
  const categories = useStore((state) => state.categories);
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
      }
    } catch (error) {
      console.error("Error updating category limit:", error);
      toast.error("Failed to update category limit. Please try again.");
    }
  };

  return (
    <>
      <main className="p-4">
        <QuickCreate />
        <Card>
          <div className="flex flex-wrap items-center justify-between space-x-4">
            <h1 className="text-2xl font-bold dark:text-white">Categories</h1>
          </div>
        </Card>
        <div className="mt-6 overflow-x-auto">
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>SN</Table.HeadCell>
              <Table.HeadCell>Category Name</Table.HeadCell>
              <Table.HeadCell>Category Type</Table.HeadCell>
              <Table.HeadCell>Limit</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {categories.map((category, index) => (
                <Table.Row
                  key={category.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{category.name}</Table.Cell>
                  <Table.Cell>{category.category_type}</Table.Cell>
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
      </main>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Edit Category Limit</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name" value="Category Name" />
              <TextInput
                id="category-name"
                value={selectedCategory?.name || ""}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="category-limit" value="Limit" />
              <TextInput
                id="category-limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Enter new limit"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleEditSubmit}>
            Edit
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Categories;
