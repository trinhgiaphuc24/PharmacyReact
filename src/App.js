import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, ProtectedStaffRoute } from "./context/AuthContext";
import Home from "./pages/Home";
import Medicine from "./pages/Medicine";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import PaymentResult from "./pages/PaymentResult";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MedicineDetail from "./pages/MedicineDetail";
import StaffDashboard from "./pages/StaffDashboard";
import StaffOrderDetail from "./pages/StaffOrderDetail";

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/medicines" element={<Medicine />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-detail/:orderId" element={<OrderDetail />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/payment/success" element={<PaymentResult />} />
              <Route path="/payment/error" element={<PaymentResult />} />
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
    </AuthProvider>
  );
};

export default App;
