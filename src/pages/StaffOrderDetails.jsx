import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Edit } from "lucide-react";
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { formatDateTime } from '../utils/helper';

// Feature components
import OrderStatusBadge from '../features/StaffOrderDetail/OrderStatusBadge';
import OrderItemsList from '../features/StaffOrderDetail/OrderItemsList';
import CustomerInfo from '../features/StaffOrderDetail/CustomerInfo';
import ShippingInfo from '../features/StaffOrderDetail/ShippingInfo';
import PaymentInfo from '../features/StaffOrderDetail/PaymentInfo';
import StatusUpdateModal from '../features/StaffOrderDetail/StatusUpdateModal';

const StaffOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const {
    order,
    isLoading,
    getShippingFee,
    updateOrderStatus
  } = useOrderDetail(orderId);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(newStatus);
      setShowStatusModal(false);
    } catch (error) {
      showError('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Đang tải thông tin đơn hàng..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy đơn hàng</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/staff/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chi tiết đơn hàng #{order.id}</h1>
            <p className="text-gray-600">Ngày đặt: {formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Trạng thái đơn hàng</h2>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Cập nhật trạng thái
                </button>
              </div>
              
              <OrderStatusBadge status={order.status} showIcon={true} />
            </div>

            <OrderItemsList 
              items={order.details}
              getShippingFee={getShippingFee}
              orderTotal={order.total}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CustomerInfo customer={order} />
            
            <ShippingInfo 
              shippingInfo={order.online_order?.ship_info}
              isHomeDelivery={order.online_order?.shipping_method === 'home_delivery'}
            />

            <PaymentInfo 
              paymentMethod={order.paymentMethod}
              shippingMethod={order.online_order?.shipping_method}
            />
          </div>
        </div>
      </div>

      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        orderId={order.id}
        currentStatus={order.status}
        onStatusChange={handleStatusChange}
      />

      <Footer />
    </div>
  );
};

export default StaffOrderDetailPage;
