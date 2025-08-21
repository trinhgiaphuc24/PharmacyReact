import React from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import EmptyState from "../ui/EmptyState";
import UnauthenticatedView from "../ui/UnauthenticatedView";
import { useCartPage } from "../hooks/useCartPage";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

// Feature components
import CartHeader from "../features/Cart/CartHeader";
import CartItemList from "../features/Cart/CartItemList";
import CartSummary from "../features/Cart/CartSummary";

const Cart = () => {
  const {
    searchQuery,
    setSearchQuery,
    isLoggedIn,
    cartItems,
    totalItems,
    selectedAmount,
    selectedItems,
    handleCheckout,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
    toggleItemSelection,
    selectAllItems,
    isAllSelected
  } = useCartPage();

  if (!isLoggedIn) {
    return (
      <UnauthenticatedView 
        icon={FaShoppingCart}
        title="Vui lòng đăng nhập"
        message="Bạn cần đăng nhập để xem giỏ hàng của mình"
        loginLink="/login"
      />
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <EmptyState 
              icon={FaShoppingCart}
              title="Giỏ hàng trống"
              description="Bạn chưa có sản phẩm nào trong giỏ hàng"
              actionText="Tiếp tục mua sắm"
              actionLink="/medicines"
              actionIcon={FaArrowLeft}
            />
          </div>
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <CartHeader totalItems={totalItems} selectedItems={selectedItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Danh sách sản phẩm */}
            <div className="lg:col-span-2">
              <CartItemList
                cartItems={cartItems}
                isAllSelected={isAllSelected}
                onSelectAll={selectAllItems}
                onClearCart={handleClearCart}
                onToggleSelection={toggleItemSelection}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <CartSummary
                selectedItems={selectedItems}
                selectedAmount={selectedAmount}
                onCheckout={handleCheckout}
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

export default Cart;
