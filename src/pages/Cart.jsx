import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaSignInAlt } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalItems, 
    getSelectedAmount,
    getSelectedItems,
    toggleItemSelection,
    selectAllItems,
    isAllSelected,
    isLoading
  } = useCart();
  const { showSuccess, showInfo } = useToast();

  // Kiểm tra trạng thái đăng nhập
  const userToken = localStorage.getItem('userToken');
  const isLoggedIn = !!userToken;

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      // Store current page to redirect back after login
      localStorage.setItem('redirectAfterLogin', '/cart');
    }
  }, [isLoggedIn]);

  const totalItems = getTotalItems();
  const selectedAmount = getSelectedAmount();
  const selectedItems = getSelectedItems();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleRemoveItem = (item) => {
    const result = removeFromCart(item.id);
    if (result.success) {
      showInfo(`Đã xóa ${item.name} khỏi giỏ hàng`);
    }
  };

  const handleClearCart = () => {
    const result = clearCart();
    if (result.success) {
      showSuccess('Đã xóa toàn bộ giỏ hàng');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  // Show login requirement if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Vui lòng đăng nhập</h2>
              <p className="text-gray-500 mb-8">Bạn cần đăng nhập để xem giỏ hàng của mình</p>
              <div className="flex gap-4 justify-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  <FaSignInAlt />
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Giỏ hàng trống</h2>
              <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Link 
                to="/medicines" 
                className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                <FaArrowLeft />
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-2xl text-green-700" />
              <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
              <div className="flex gap-2">
                <span className="border border-green-700 text-green-700 text-sm px-2 py-1 rounded-full">
                  {totalItems} sản phẩm
                </span>
                {selectedItems !== totalItems && (
                  <span className="bg-green-700 text-white text-sm px-2 py-1 rounded-full">
                    {selectedItems} được chọn
                  </span>
                )}
              </div>
            </div>
            <Link 
              to="/medicines" 
              className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
            >
              <FaArrowLeft />
              Tiếp tục mua sắm
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAllSelected()}
                          onChange={(e) => selectAllItems(e.target.checked)}
                          className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-lg font-semibold text-gray-800">
                          Chọn tất cả ({cartItems.length} sản phẩm)
                        </span>
                      </label>
                    </div>
                    <button 
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className={`p-4 transition-colors ${item.selected ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className="flex gap-4">
                        {/* Checkbox */}
                        <div className="flex-shrink-0 flex items-start pt-2">
                          <input
                            type="checkbox"
                            checked={item.selected || false}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-500"
                          />
                        </div>
                        
                        {/* Hình ảnh sản phẩm */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`w-20 h-20 object-cover rounded-lg border transition-opacity ${
                              item.selected ? 'opacity-100' : 'opacity-50'
                            }`}
                          />
                        </div>
                        
                        {/* Thông tin sản phẩm */}
                        <div className="flex-1">
                          <Link 
                            to={`/medicines/${item.id}`}
                            className={`font-medium hover:text-green-700 line-clamp-2 ${
                              item.selected ? 'text-gray-800' : 'text-gray-500'
                            }`}
                          >
                            {item.name}
                          </Link>
                          <div className={`text-sm mt-1 ${item.selected ? 'text-gray-500' : 'text-gray-400'}`}>
                            <span className="mr-4">Loại: {item.genre}</span>
                            <span>Xuất xứ: {item.produce}</span>
                          </div>
                          <div className={`font-bold text-lg mt-2 ${item.selected ? 'text-green-700' : 'text-gray-400'}`}>
                            {item.price.toLocaleString()} đ
                          </div>
                        </div>
                        
                        {/* Điều khiển số lượng */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Xóa sản phẩm"
                          >
                            <FaTrash />
                          </button>
                          
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={`p-2 hover:bg-gray-100 transition ${
                                !item.selected ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={!item.selected}
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <span className={`px-4 py-2 min-w-[50px] text-center font-medium ${
                              item.selected ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={`p-2 hover:bg-gray-100 transition ${
                                !item.selected ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={!item.selected}
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>
                          
                          <div className={`font-bold ${item.selected ? 'text-green-700' : 'text-gray-400'}`}>
                            {(item.price * item.quantity).toLocaleString()} đ
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-4">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
                  {selectedItems === 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                      Vui lòng chọn sản phẩm để thanh toán
                    </p>
                  )}
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({selectedItems} sản phẩm)</span>
                    <span>{selectedAmount.toLocaleString()} đ</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Tổng cộng</span>
                    <span className="text-green-700">{selectedAmount.toLocaleString()} đ</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <button 
                    onClick={handleCheckout}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      selectedItems > 0 
                        ? 'bg-green-700 text-white hover:bg-green-800' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={selectedItems === 0}
                  >
                    {selectedItems > 0 
                      ? 'Thanh toán' 
                      : 'Chọn sản phẩm để thanh toán'
                    }
                  </button>
                  
                  <Link 
                    to="/medicines"
                    className="block w-full text-center bg-white border border-green-700 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
                  >
                    Tiếp tục mua sắm
                  </Link>
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

export default Cart;
