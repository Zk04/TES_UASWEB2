import React, { useState, useEffect } from "react";
import InventoryList from "../components/InventoryList";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Box, Container, Heading, useToast } from "@chakra-ui/react";

const ManageProductPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/inventory/items?page=${currentPage}`);
        setItems(response.data.items);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchFilters = async () => {
      try {
        const [categoriesRes, brandsRes, sellersRes] = await Promise.all([
          axios.get("/api/inventory/categories"),
          axios.get("/api/inventory/brands"),
          axios.get("/api/inventory/sellers"),
        ]);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
        setSellers(sellersRes.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchItems();
    fetchFilters();
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
  
    try {
      await axios.delete(`/api/inventory/${id}`);
      
      setItems(items.filter(item => item._id !== id));
      toast({
        title: "Item deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error deleting item",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (id, editData) => {
    try {
      await axios.put(`/api/inventory/${id}`, editData);
      
      const response = await axios.get(`/api/inventory/items?page=${currentPage}`);
      setItems(response.data.items);
      toast({
        title: "Item updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating item",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddStock = async (id, stockData) => {
    try {
      await axios.put(`/api/inventory/items/${id}/add-stock`, stockData);
      
      const response = await axios.get(`/api/inventory/items?page=${currentPage}`);
      setItems(response.data.items);
      toast({
        title: "Stock added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding stock",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSell = async (id, saleData) => {
    try {
      await axios.put(`/api/inventory/items/${id}/sell`, saleData);
      const response = await axios.get(`/api/inventory/items?page=${currentPage}`);
      setItems(response.data.items);
      toast({
        title: "Item sold successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error selling item",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Box display="flex" bg="gray.900" color="white" minH="100vh">
      <Sidebar onLogout={handleLogout} />
      <Container maxW="container.xl" py={3}>
        <Heading mb={3} textAlign="center">
          Manage Stock
        </Heading>
        <InventoryList
          items={items}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSell={handleSell}
          onAddStock={handleAddStock}
          categories={categories}
          brands={brands}
          sellers={sellers}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Container>
    </Box>
  );
};

export default ManageProductPage;