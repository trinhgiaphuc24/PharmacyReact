import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Home from "./pages/Home";
import Medicine from "./pages/Medicine";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MedicineDetail from "./pages/MedicineDetail";
import StaffDashboard from "./pages/StaffDashboard";
import StaffOrderDetail from "./pages/StaffOrderDetail";
import ProtectedStaffRoute from "./components/ProtectedStaffRoute";

const App = () => (
  <ToastProvider>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicines" element={<Medicine />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/medicines/:id/" element={<MedicineDetail />} />
          {/* Staff Routes */}
          <Route path="/staff/dashboard" element={
            <ProtectedStaffRoute>
              <StaffDashboard />
            </ProtectedStaffRoute>
          } />
          <Route path="/staff/orders/:orderId" element={
            <ProtectedStaffRoute>
              <StaffOrderDetail />
            </ProtectedStaffRoute>
          } />
        </Routes>
      </Router>
    </CartProvider>
  </ToastProvider>
);

export default App;
