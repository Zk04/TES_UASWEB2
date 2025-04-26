import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from "axios";
import Sidebar from "../components/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStock: 0,
    totalItemSold: 0,
    totalRevenue: 0,
  });
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, dailyRes] = await Promise.all([
          axios.get("/api/inventory/stats"),
          axios.get("/api/inventory/daily-sales"),
        ]);
        setStats(statsRes.data);
        setDailyData(dailyRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: dailyData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Sales Revenue',
        data: dailyData.map(d => d.revenue),
        fill: true,
        backgroundColor: 'rgba(66, 153, 225, 0.2)',
        borderColor: 'rgba(66, 153, 225, 1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  };
  return (
    <Box display="flex" bg="gray.900" color="white" minH="100vh">
      <Sidebar />
      <Container maxW="container.xl" py={5}>
        <Heading mb={6}>Dashboard</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat
            px={{ base: 4, md: 8 }}
            py={5}
            bg="gray.800"
            rounded="lg"
            boxShadow="lg"
          >
            <StatLabel fontSize="lg">Total Stock</StatLabel>
            <StatNumber fontSize="4xl">{stats.totalStock}</StatNumber>
          </Stat>

          <Stat
            px={{ base: 4, md: 8 }}
            py={5}
            bg="gray.800"
            rounded="lg"
            boxShadow="lg"
          >
            <StatLabel fontSize="lg">Total Items Sold</StatLabel>
            <StatNumber fontSize="4xl">{stats.totalItemSold}</StatNumber>
          </Stat>

          <Stat
            px={{ base: 4, md: 8 }}
            py={5}
            bg="gray.800"
            rounded="lg"
            boxShadow="lg"
          >
            <StatLabel fontSize="lg">Total Revenue</StatLabel>
            <StatNumber fontSize="4xl">
              ${stats.totalRevenue.toLocaleString()}
            </StatNumber>
          </Stat>
        </SimpleGrid>

        <Box bg="gray.800" p={6} rounded="lg" boxShadow="lg">
          <Heading size="md" mb={4}>Daily Sales and Revenue</Heading>
          <Box h="400px">
            <Line data={chartData} options={chartOptions} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;