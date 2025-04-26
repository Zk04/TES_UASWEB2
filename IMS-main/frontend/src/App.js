import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ManageProductsPage from "./pages/ManageProductPage";
import ManageSalesPage from "./pages/ManageSalesPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-products" 
          element={
            <ProtectedRoute>
              <ManageProductsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-sales" 
          element={
            <ProtectedRoute>
              <ManageSalesPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;