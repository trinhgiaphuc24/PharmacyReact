import React, { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Eye, Edit, Search, Filter } from "lucide-react";
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();

  // Mock data - trong thực tế sẽ gọi API
  useEffect(() => {
    const mockOrders = [
      {
        id: "DH001",
        customerName: "Nguyễn Văn A",
        customerPhone: "0901234567",
        customerAddress: "123 Nguyễn Trãi, Q.1, TP.HCM",
        totalAmount: 250000,
        status: "pending",
        createdAt: "2025-01-15T08:30:00",
        medicines: [
          { name: "Paracetamol 500mg", quantity: 2, price: 15000 },
          { name: "Vitamin C 1000mg", quantity: 1, price: 220000 }
        ],
        paymentMethod: "cash"
      },
      {
        id: "DH002", 
        customerName: "Trần Thị B",
        customerPhone: "0912345678",
        customerAddress: "456 Lê Văn Sỹ, Q.3, TP.HCM",
        totalAmount: 180000,
        status: "waiting_for_pickup",
        createdAt: "2025-01-15T09:15:00",
        medicines: [
          { name: "Amoxicillin 250mg", quantity: 1, price: 85000 },
          { name: "Cảm cúm 999", quantity: 2, price: 47500 }
        ],
        paymentMethod: "zalopay"
      },
      {
        id: "DH003",
        customerName: "Lê Văn C", 
        customerPhone: "0923456789",
        customerAddress: "789 Võ Văn Tần, Q.3, TP.HCM",
        totalAmount: 320000,
        status: "waiting_for_delivery",
        createdAt: "2025-01-15T10:00:00",
        medicines: [
          { name: "Thuốc ho Bổ phế", quantity: 1, price: 120000 },
          { name: "Dầu gió xanh", quantity: 4, price: 50000 }
        ],
        paymentMethod: "cash"
      },
      {
        id: "DH004",
        customerName: "Phạm Thị D",
        customerPhone: "0934567890", 
        customerAddress: "321 Hai Bà Trưng, Q.1, TP.HCM",
        totalAmount: 95000,
        status: "returned",
        createdAt: "2025-01-15T11:30:00",
        medicines: [
          { name: "Thuốc đau bụng", quantity: 1, price: 45000 },
          { name: "Nước muối sinh lý", quantity: 2, price: 25000 }
        ],
        paymentMethod: "zalopay"
      },
      {
        id: "DH005",
        customerName: "Hoàng Văn E",
        customerPhone: "0945678901",
        customerAddress: "654 Nguyễn Đình Chiểu, Q.3, TP.HCM", 
        totalAmount: 420000,
        status: "delivered",
        createdAt: "2025-01-14T14:20:00",
        medicines: [
          { name: "Thuốc tiểu đường", quantity: 1, price: 350000 },
          { name: "Que thử đường huyết", quantity: 1, price: 70000 }
        ],
        paymentMethod: "cash"
      },
      {
        id: "DH006",
        customerName: "Võ Thị F",
        customerPhone: "0956789012",
        customerAddress: "987 Pasteur, Q.1, TP.HCM",
        totalAmount: 75000, 
        status: "canceled",
        createdAt: "2025-01-14T16:45:00",
        medicines: [
          { name: "Thuốc nhỏ mắt", quantity: 1, price: 35000 },
          { name: "Băng cá nhân", quantity: 2, price: 20000 }
        ],
        paymentMethod: "cash"
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders by status and search
  useEffect(() => {
    let filtered = orders;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery)
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "waiting_for_pickup": return "bg-blue-100 text-blue-800";
      case "waiting_for_delivery": return "bg-orange-100 text-orange-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "returned": return "bg-purple-100 text-purple-800";
      case "canceled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
      case "pending": return <Clock className="w-4 h-4" />;
      case "waiting_for_pickup": return <Package className="w-4 h-4" />;
      case "waiting_for_delivery": return <Package className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "returned": return <XCircle className="w-4 h-4" />;
      case "canceled": return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setShowStatusModal(false);
    setSelectedOrder(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản lý đơn hàng</h1>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ lấy hàng</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'waiting_for_pickup').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ giao hàng</p>
                <p className="text-2xl font-bold text-orange-600">
                  {orders.filter(o => o.status === 'waiting_for_delivery').length}
                </p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã giao</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trả hàng</p>
                <p className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'returned').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã hủy</p>
                <p className="text-2xl font-bold text-red-600">
                  {orders.filter(o => o.status === 'canceled').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo mã đơn hàng, tên khách hàng, số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="waiting_for_pickup">Chờ lấy hàng</option>
                <option value="waiting_for_delivery">Chờ giao hàng</option>
                <option value="delivered">Đã giao</option>
                <option value="returned">Trả hàng</option>
                <option value="canceled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/staff/orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="Cập nhật trạng thái"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái đơn hàng</h3>
            <p className="text-gray-600 mb-4">Đơn hàng: {selectedOrder.id}</p>
            
            <div className="space-y-3">
              {['pending', 'waiting_for_pickup', 'waiting_for_delivery', 'delivered', 'returned', 'canceled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(selectedOrder.id, status)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                    selectedOrder.status === status
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

export default StaffDashboard;
