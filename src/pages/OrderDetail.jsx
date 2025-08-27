import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import Spinner from "../ui/Spinner";
import Breadcrumb from "../ui/Breadcrumb";
import OrderDetailHeader from "../features/OrderDetail/OrderDetailHeader";
import OrderItems from "../features/OrderDetail/OrderItems";
import UserShippingInfo from "../features/OrderDetail/UserShippingInfo";
import OrderDetailSummary from "../features/OrderDetail/OrderDetailSummary";
import { useUserOrderDetail } from "../hooks/useUserOrderDetail";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    order, 
    isLoading, 
    isCanceling, 
    isExporting,
    getShippingFee, 
    handleCancelOrder,
    handleExportPDF
  } = useUserOrderDetail(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-16">
          <Spinner />
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy đơn hàng</h2>
          <Link to="/orders" className="text-green-700 hover:underline">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  const breadcrumbItems = [
    { link: '/orders', label: 'Đơn hàng của tôi' },
    { label: `Chi tiết đơn hàng #${order.id}` }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OrderDetailHeader order={order} />
              <OrderItems items={order.details} />
              <UserShippingInfo order={order} />
            </div>

            <div className="lg:col-span-1">
              <OrderDetailSummary 
                order={order}
                getShippingFee={getShippingFee}
                isCanceling={isCanceling}
                onCancel={handleCancelOrder}
                isExporting={isExporting}
                onExportPDF={handleExportPDF}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default OrderDetail;
