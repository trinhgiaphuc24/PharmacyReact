import React from "react";
import { Link } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import { FaClipboardList, FaEye, FaArrowRight } from "react-icons/fa";

const Orders = () => {
  // Danh sách đơn hàng mẫu
  const orders = [
    {
      id: "DH123456789",
      date: "29-11-2018",
      status: "Chờ lấy hàng",
      statusColor: "orange",
      total: 315000,
      itemCount: 3,
      expectedDelivery: "02-12-2018"
    },
    {
      id: "DH123456788",
      date: "25-11-2018", 
      status: "Đã giao",
      statusColor: "green",
      total: 150000,
      itemCount: 2,
      expectedDelivery: "28-11-2018"
    },
    {
      id: "DH123456787",
      date: "20-11-2018",
      status: "Đã hủy",
      statusColor: "red", 
      total: 85000,
      itemCount: 1,
      expectedDelivery: "23-11-2018"
    }
  ];

  const getStatusBgColor = (color) => {
    switch(color) {
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <FaClipboardList className="text-green-700 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
          </div>

          {/* Danh sách đơn hàng */}
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      {/* Thông tin đơn hàng */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Mã đơn hàng: {order.id}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(order.statusColor)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Ngày đặt:</span>
                            <div>{order.date}</div>
                          </div>
                          <div>
                            <span className="font-medium">Tổng tiền:</span>
                            <div className="text-green-700 font-semibold">
                              {order.total.toLocaleString()} đ
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Số sản phẩm:</span>
                            <div>{order.itemCount} sản phẩm</div>
                          </div>
                        </div>

                        {order.status !== "Đã hủy" && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">Dự kiến giao:</span>
                            <span className="ml-1">{order.expectedDelivery}</span>
                          </div>
                        )}
                      </div>

                      {/* Nút xem chi tiết */}
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/order-tracking?orderId=${order.id}`}
                          className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors"
                        >
                          <FaEye className="w-4 h-4" />
                          Xem chi tiết
                        </Link>
                        
                        {order.status === "Đã giao" && (
                          <button className="inline-flex items-center justify-center gap-2 text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors border border-green-700 ">
                            Mua lại
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-16">
              <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Chưa có đơn hàng nào</h2>
              <p className="text-gray-500 mb-8">
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              
              <Link 
                to="/medicines" 
                className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Bắt đầu mua sắm
                <FaArrowRight />
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default Orders;
