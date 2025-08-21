import React from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import SuccessMessage from "../features/Order/SuccessMessage";
import SuccessActions from "../features/Order/SuccessActions";
import { useOrderSuccess } from "../hooks/useOrderSuccess";

const OrderSuccess = () => {
  const { orderId } = useOrderSuccess();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <SuccessMessage />
          <SuccessActions orderId={orderId} />
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default OrderSuccess;
