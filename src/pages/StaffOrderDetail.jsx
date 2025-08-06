import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Phone, MapPin, CreditCard, Edit } from "lucide-react";
import Header from '../ui/Header';
import Footer from '../ui/Footer';

const StaffOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);

  // Lấy thông tin user từ localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // Mock data - trong thực tế sẽ gọi API
  useEffect(() => {
    // Simulate API call
    const mockOrder = {
      id: orderId,
      customerName: "Nguyễn Văn A",
      customerPhone: "0901234567",
      customerEmail: "nguyenvana@email.com",
      customerAddress: "123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM",
      totalAmount: 250000,
      shippingFee: 15000,
      discount: 0,
      finalAmount: 265000,
      status: "waiting_for_pickup",
      createdAt: "2025-01-15T08:30:00",
      medicines: [
        { 
          id: 1,
          name: "Paracetamol 500mg", 
          quantity: 2, 
          price: 15000,
          image: "https://via.placeholder.com/80x80",
          description: "Thuốc giảm đau, hạ sốt"
        },
        { 
          id: 2,
          name: "Vitamin C 1000mg", 
          quantity: 1, 
          price: 220000,
          image: "https://via.placeholder.com/80x80",
          description: "Bổ sung vitamin C tăng cường sức đề kháng"
        }
      ],
      paymentMethod: "cash",
      notes: "Giao hàng trước 5h chiều"
    };

    const mockStatusHistory = [
      {
        status: "pending",
        timestamp: "2025-01-15T08:30:00",
        note: "Đơn hàng được tạo",
        staff: "Hệ thống"
      },
      {
        status: "waiting_for_pickup", 
        timestamp: "2025-01-15T08:45:00",
        note: "Đã xác nhận đơn hàng, chờ lấy hàng",
        staff: "Nguyễn Thị B"
      }
    ];

    setOrder(mockOrder);
    setStatusHistory(mockStatusHistory);
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "waiting_for_pickup": return "bg-blue-100 text-blue-800 border-blue-200";
      case "waiting_for_delivery": return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "returned": return "bg-purple-100 text-purple-800 border-purple-200";
      case "canceled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Chờ xác nhận";
      case "waiting_for_pickup": return "Chờ lấy hàng";
      case "waiting_for_delivery": return "Chờ giao hàng";
      case "delivered": return "Đã giao";
      case "returned": return "Trả hàng";
      case "canceled": return "Đã hủy";
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-5 h-5" />;
      case "waiting_for_pickup": return <Package className="w-5 h-5" />;
      case "waiting_for_delivery": return <Package className="w-5 h-5" />;
      case "delivered": return <CheckCircle className="w-5 h-5" />;
      case "returned": return <XCircle className="w-5 h-5" />;
      case "canceled": return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const handleStatusChange = (newStatus) => {
    const newHistoryEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: `Cập nhật trạng thái thành "${getStatusText(newStatus)}"`,
      staff: userInfo.name || userInfo.username
    };

    setOrder(prev => ({ ...prev, status: newStatus }));
    setStatusHistory(prev => [...prev, newHistoryEntry]);
    setShowStatusModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
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
            onClick={() => navigate('/staff/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng {order.id}</h1>
            <p className="text-gray-600">Thời gian đặt: {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Trạng thái đơn hàng</h2>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Cập nhật
                </button>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="font-medium">{getStatusText(order.status)}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Danh sách thuốc</h2>
              <div className="space-y-4">
                {order.medicines.map((medicine) => (
                  <div key={medicine.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{medicine.name}</h3>
                      <p className="text-sm text-gray-600">{medicine.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">Số lượng: {medicine.quantity}</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(medicine.price)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        {formatCurrency(medicine.price * medicine.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Lịch sử trạng thái</h2>
              <div className="space-y-4">
                {statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className={`p-2 rounded-full ${getStatusColor(history.status)}`}>
                      {getStatusIcon(history.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{getStatusText(history.status)}</span>
                        <span className="text-sm text-gray-500">bởi {history.staff}</span>
                      </div>
                      <p className="text-sm text-gray-600">{history.note}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(history.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tên khách hàng</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-sm">{order.customerAddress}</span>
                </div>
                {order.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm">{order.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin thanh toán</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {order.paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : 'ZaloPay'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí giao hàng:</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">{formatCurrency(order.finalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Ghi chú</h2>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái đơn hàng</h3>
            <p className="text-gray-600 mb-4">Đơn hàng: {order.id}</p>
            
            <div className="space-y-3">
              {['pending', 'waiting_for_pickup', 'waiting_for_delivery', 'delivered', 'returned', 'canceled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                    order.status === status
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {getStatusIcon(status)}
                  <span className="font-medium">{getStatusText(status)}</span>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StaffOrderDetail;
