import React, { useState } from "react";
import { Box, FormControl, FormLabel, Input, Button, VStack, useToast, Text} from "@chakra-ui/react";
import axios from "axios";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", { username, password });
      toast({ title: "Registration successful", status: "success", duration: 3000, isClosable: true });
      navigate("/login"); 
    } catch (error) {
      toast({ title: "Registration failed", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box
      bg="gray.900"
      color="white"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="gray.800"
        p={8}
        borderRadius="md"
        boxShadow="lg"
        width="400px"
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          REGISTER
        </Text>
        <Box as="form" onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                bg="gray.700"
                borderColor="gray.600"
                _hover={{ borderColor: "gray.500" }}
                _focus={{ borderColor: "blue.500" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                bg="gray.700"
                borderColor="gray.600"
                _hover={{ borderColor: "gray.500" }}
                _focus={{ borderColor: "blue.500" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full">
              Register
            </Button>
          </VStack>
        </Box>
        <Text mt={4}>
          Already have an account?{" "}
          <ChakraLink as={RouterLink} to="/login" color="blue.400">
            Login Here
          </ChakraLink>
        </Text>
      </Box>
    </Box>
  );
};

export default RegisterPage;