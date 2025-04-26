import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const InventoryPage = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    stock: "",
    seller: "",
    category: "",
    brand: "",
    description: "",
  });
  const [sellers, setSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newSeller, setNewSeller] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const toast = useToast();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellersRes, categoriesRes, brandsRes] = await Promise.all([
          axios.get("/api/inventory/sellers"),
          axios.get("/api/inventory/categories"),
          axios.get("/api/inventory/brands"),
        ]);
        setSellers(sellersRes.data);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("/api/inventory/items", productData);
      toast({
        title: "Product added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setProductData({
        name: "",
        price: "",
        stock: "",
        seller: "",
        category: "",
        brand: "",
        description: "",
      });
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast({
        title: "Error adding product",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateSeller = async () => {
    try {
      const response = await axios.post("/api/inventory/sellers", { name: newSeller });
      toast({
        title: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSellers([...sellers, response.data.seller]); 
      setNewSeller(""); 
    } catch (error) {
      toast({
        title: "Error creating seller",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await axios.post("/api/inventory/categories", { name: newCategory });
      toast({
        title: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCategories([...categories, response.data.category]); 
      setNewCategory(""); 
    } catch (error) {
      toast({
        title: "Error creating category",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateBrand = async () => {
    try {
      const response = await axios.post("/api/inventory/brands", { name: newBrand });
      toast({
        title: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setBrands([...brands, response.data.brand]); 
      setNewBrand(""); 
    } catch (error) {
      toast({
        title: "Error creating brand",
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
      {}
      <Sidebar onLogout={handleLogout} />

      {}
      <Container maxW="container.xl" py={3}>
        <Heading mb={3} textAlign="center">
          ADD NEW PRODUCT
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {}
          <Box bg="gray.800" p={6} borderRadius="md" boxShadow="lg">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Stock</FormLabel>
                <Input
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                  placeholder="Stock"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Seller</FormLabel>
                <Select
                  name="seller"
                  value={productData.seller}
                  onChange={handleInputChange}
                  placeholder="Select Seller"
                  color={"white"} 
                  bg="gray.700" 
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                >
                  {sellers.map((seller) => (
                    <option
                      key={seller._id}
                      value={seller.name}
                      style={{
                        backgroundColor: "#2D3748", 
                        color: "white", 
                      }}
                    >
                      {seller.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  placeholder="Select Category"
                  bg="gray.700"
                  color="white"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                >
                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category.name}
                      style={{
                        backgroundColor: "#2D3748",
                        color: "white",
                      }}
                    >
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Brand</FormLabel>
                <Select
                  name="brand"
                  value={productData.brand}
                  onChange={handleInputChange}
                  placeholder="Select Brand"
                  bg="gray.700"
                  color="white"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                >
                  {brands.map((brand) => (
                    <option
                      key={brand._id}
                      value={brand.name}
                      style={{
                        backgroundColor: "#2D3748",
                        color: "white",
                      }}
                    >
                      {brand.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
              </FormControl>
              <Button colorScheme="blue" width="full" onClick={handleAddProduct}>
                ADD PRODUCT
              </Button>
            </VStack>
          </Box>

          <VStack spacing={6}>
            <Box bg="gray.800" p={6} borderRadius="md" boxShadow="lg" width="full">
              <Heading size="md" mb={4}>
                CREATE NEW SELLER
              </Heading>
              <FormControl>
                <Input
                  value={newSeller}
                  onChange={(e) => setNewSeller(e.target.value)}
                  placeholder="Seller Name"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
              </FormControl>
              <Button colorScheme="blue" width="full" mt={4} onClick={handleCreateSeller}>
                CREATE SELLER
              </Button>
            </Box>

            <Box bg="gray.800" p={6} borderRadius="md" boxShadow="lg" width="full">
              <Heading size="md" mb={4}>
                CREATE NEW CATEGORY
              </Heading>
              <FormControl>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category Name"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
              </FormControl>
              <Button colorScheme="blue" width="full" mt={4} onClick={handleCreateCategory}>
                CREATE CATEGORY
              </Button>
            </Box>

            <Box bg="gray.800" p={6} borderRadius="md" boxShadow="lg" width="full">
              <Heading size="md" mb={4}>
                CREATE NEW BRAND
              </Heading>
              <FormControl>
                <Input
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Brand Name"
                  bg="gray.700"
                  borderColor="gray.600"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                />
              </FormControl>
              <Button colorScheme="blue" width="full" mt={4} onClick={handleCreateBrand}>
                CREATE BRAND
              </Button>
            </Box>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default InventoryPage;