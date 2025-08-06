import React from "react";
import { Link } from "react-router-dom";
import Header from "../ui/Header";
import Footer from  "../ui/Footer";
import Base from "../ui/Base";
import { 
  FaArrowLeft, 
  FaClipboardList, 
  FaCreditCard,
  FaTruck,
  FaHandHoldingHeart,
  FaCheck
} from "react-icons/fa";

const OrderTracking = () => {
  // Thông tin đơn hàng mẫu
  const orderInfo = {
    orderId: "DH123456789",
    orderDate: "29-11-2018",
    expectedDelivery: "02-12-2018",
    customerName: "Nguyễn Văn A",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM"
  };

  // Các bước theo dõi đơn hàng
  const trackingSteps = [
    {
      id: 1,
      title: "Đơn Hàng Đã Đặt",
      description: "Đơn hàng của bạn đã được tiếp nhận",
      icon: FaClipboardList,
      date: "29-11-2018",
      time: "14:30",
      completed: true
    },
    {
      id: 2,
      title: "Đã Xác Nhận Thông Tin Thanh Toán",
      description: "Thông tin thanh toán đã được xác nhận",
      icon: FaCreditCard,
      date: "29-11-2018",
      time: "15:15",
      completed: true
    },
    {
      id: 3,
      title: "Chờ Lấy Hàng",
      description: "Đơn hàng đang được chuẩn bị và chờ lấy hàng",
      icon: FaTruck,
      date: "30-11-2018",
      time: "09:00",
      completed: false,
      current: true
    },
    {
      id: 4,
      title: "Đang Giao",
      description: "Đơn hàng đang được giao đến bạn",
      icon: FaHandHoldingHeart,
      date: "",
      time: "",
      completed: false
    }
  ];

  // Danh sách sản phẩm đã mua
  const orderItems = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      image: "/api/placeholder/60/60",
      quantity: 2,
      price: 25000,
      total: 50000
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      image: "/api/placeholder/60/60",
      quantity: 1,
      price: 180000,
      total: 180000
    },
    {
      id: 3,
      name: "Amoxicillin 250mg",
      image: "/api/placeholder/60/60",
      quantity: 1,
      price: 85000,
      total: 85000
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Link to="/orders" className="flex items-center gap-1 hover:text-green-700">
              <FaArrowLeft className="text-xs" />
              Danh sách đơn hàng
            </Link>
            <span>/</span>
            <span className="text-green-700 font-medium">Chi tiết đơn hàng</span>
          </div>

          {/* Header thông tin đơn hàng */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Mã đơn hàng: {orderInfo.orderId}
                </h1>
                <p className="text-gray-600">
                  Ngày đặt: {orderInfo.orderDate} | Dự kiến giao: {orderInfo.expectedDelivery}
                </p>
              </div>
            </div>
          </div>

          {/* Layout 1 cột */}
          <div className="space-y-6">
            {/* Tiến trình đơn hàng - Hàng ngang */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Tiến trình đơn hàng</h2>
                
                {/* Nút hủy đơn hàng */}
                <button className="inline-flex items-center justify-center gap-2 bg-white border border-red-600 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition">
                  Hủy đơn hàng
                </button>
              </div>
              
              <div className="relative">
                {/* Timeline line ngang */}
                <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200"></div>
                
                <div className="grid grid-cols-4 gap-4">
                  {trackingSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isCompleted = step.completed;
                    const isCurrent = step.current;
                    
                    return (
                      <div key={step.id} className="relative flex flex-col items-center text-center">
                        {/* Icon circle */}
                        <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 mb-3 ${
                          isCompleted 
                            ? 'bg-green-700 border-green-700' 
                            : isCurrent 
                              ? 'bg-orange-500 border-orange-500' 
                              : 'bg-gray-200 border-gray-200'
                        }`}>
                          {isCompleted ? (
                            <FaCheck className="text-white text-lg" />
                          ) : (
                            <IconComponent className={`text-lg ${
                              isCurrent ? 'text-white' : 'text-gray-400'
                            }`} />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div>
                          <h3 className={`text-sm font-semibold mb-1 ${
                            isCompleted ? 'text-green-700' : 
                            isCurrent ? 'text-orange-600' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`text-xs mb-2 ${
                            isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                          
                          {(step.date || step.time) && (
                            <div className={`text-xs ${
                              isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              <div>{step.date}</div>
                              <div>{step.time}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Thông tin đơn hàng - Grid 2 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin giao hàng */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Người nhận</h3>
                    <p className="text-gray-600">{orderInfo.customerName}</p>
                    <p className="text-gray-600">{orderInfo.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>
                    <p className="text-gray-600">{orderInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm đã mua</h2>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1 text-sm">{item.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">SL: {item.quantity}</span>
                          <span className="font-semibold text-green-700 text-sm">
                            {item.total.toLocaleString()} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Tổng tiền */}
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-gray-800">Tổng:</span>
                      <span className="text-green-700">
                        {orderItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default OrderTracking;
