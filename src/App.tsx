import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import RentalsPage from "./pages/rentals/RentalsPage";
import PaymentPage from "./pages/payment/PaymentPage";
import Dashboard from "./pages/Dashboard";
import AddAccountPage from "./pages/marketplace/AddAccountPage.tsx";
import PaymentForm from "./pages/marketplace/PaymentForm.tsx";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
          <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/add-account" element={<AddAccountPage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/deposit" element={<PaymentForm />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
