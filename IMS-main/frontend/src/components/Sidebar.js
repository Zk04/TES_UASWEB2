import React from "react";
import { Box, VStack, Text, Button, Icon} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaChartLine,   FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ onLogout }) => {
  return (
    <Box
      bg="gray.900" 
      color="white"
      minH="100vh"
      width="250px"
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack align="start" spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          IMS
        </Text>
        <Link to="/dashboard" style={{ textDecoration: "none", width: "100%" }}>
          <Button
            leftIcon={<Icon as={FaTachometerAlt} />}
            bg="gray.800"
            _hover={{ bg: "gray.700" }}
            color="white"
            variant="solid"
            width="100%"
            justifyContent="flex-start"
          >
            Dashboard
          </Button>
        </Link>
        <Link to="/inventory" style={{ textDecoration: "none", width: "100%" }}>
          <Button
            leftIcon={<Icon as={FaBox} />}
            bg="gray.800" 
            _hover={{ bg: "gray.700" }}
            color="white"
            variant="ghost"
            width="100%"
            justifyContent="flex-start"
          >
            Add Product
          </Button>
        </Link>
        <Link to="/manage-products" style={{ textDecoration: "none", width: "100%" }}>
          <Button
            leftIcon={<Icon as={FaBox} />}
            bg="gray.800" 
            _hover={{ bg: "gray.700" }} 
            color="white"
            variant="ghost"
            width="100%"
            justifyContent="flex-start"
          >
            Manage Stock
          </Button>
        </Link>
        <Link to="/manage-sales" style={{ textDecoration: "none", width: "100%" }}>
          <Button
            leftIcon={<Icon as={FaChartLine} />}
            bg="gray.800" 
            _hover={{ bg: "gray.700" }} 
            color="white"
            variant="ghost"
            width="100%"
            justifyContent="flex-start"
          >
            Manage Sales
          </Button>
        </Link>
      </VStack>
      <Button
        leftIcon={<Icon as={FaSignOutAlt} />}
        bg="blue.500" 
        _hover={{ bg: "blue.400" }} 
        color="white"
        variant="solid"
        width="100%"
        onClick={onLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Sidebar;