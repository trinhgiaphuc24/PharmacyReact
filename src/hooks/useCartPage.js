import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart as useCartContext } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export const useCartPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
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
    isAllSelected
  } = useCartContext();
  const { showSuccess, showInfo } = useToast();

  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/cart');
    }
  }, [isLoggedIn]);

  const totalItems = getTotalItems();
  const selectedAmount = getSelectedAmount();
  const selectedItems = getSelectedItems();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    const result = await updateQuantity(id, newQuantity);
    if (!result.success && result.message) {
      showInfo(result.message);
    }
  };

  const handleRemoveItem = async (item) => {
    const result = await removeFromCart(item.id);
    if (result.success) {
      showInfo(`Đã xóa ${item.name} khỏi giỏ hàng`);
    } else {
      showInfo(result.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      showSuccess('Đã xóa toàn bộ giỏ hàng');
    } else {
      showInfo(result.message || 'Có lỗi xảy ra khi xóa giỏ hàng');
    }
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    isLoggedIn,
    cartItems,
    totalItems,
    selectedAmount,
    selectedItems,
    
    // Actions
    handleCheckout,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
    toggleItemSelection,
    selectAllItems,
    isAllSelected
  };
};
