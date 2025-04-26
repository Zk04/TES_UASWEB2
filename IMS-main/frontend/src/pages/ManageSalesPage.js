import React, { useState, useEffect } from "react";
import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Heading,
  Spinner,
  Text,
  Container,
  HStack,
  Input,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { DeleteIcon } from "@chakra-ui/icons";

const ManageSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/inventory/sales");
        setSales(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setError("Failed to load sales data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || sale.date.includes(selectedDate);
    return matchesSearch && matchesDate;
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        bg="gray.900"
        color="white"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        bg="gray.900"
        color="white"
      >
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale record?")) {
      try {
        await axios.delete(`/api/inventory/sales/${id}`);
        setSales(sales.filter(sale => sale._id !== id));
        toast({
          title: "Sale record deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error deleting sale record",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
        <Heading mb={3}>Manage Sales</Heading>
        
        <HStack spacing={4} mb={4}>
          <Input
            placeholder="Search by Product Name"
            value={searchTerm}
            bg="gray.700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            type="date"
            value={selectedDate}
            bg="gray.700"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </HStack>

        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th color="gray.400">Date</Th>
              <Th color="gray.400">Product Name</Th>
              <Th color="gray.400">Price</Th>
              <Th color="gray.400">Quantity</Th>
              <Th color="gray.400">Total</Th>
              <Th color="gray.400">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSales.map((sale) => (
              <Tr key={sale._id}>
                <Td>{new Date(sale.date).toLocaleDateString()}</Td>
                <Td>{sale.itemName}</Td>
                <Td>Rp {sale.price.toLocaleString()}</Td>
                <Td>{sale.quantity}</Td>
                <Td>Rp {sale.total.toLocaleString()}</Td>
                <Td>
                  <IconButton
                    size="sm"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDelete(sale._id)}
                    aria-label="Delete sale"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    </Box>
  );
};

export default ManageSalesPage;