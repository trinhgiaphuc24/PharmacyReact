import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createAuthenticatedAxios, endpoints } from '../utils/axiosConfig';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper to check if user is logged in
  const isUserLoggedIn = useCallback(() => {
    return !!(localStorage.getItem('token') || localStorage.getItem('userToken'));
  }, []);

  // Sync cart with backend
  const syncCartWithBackend = useCallback(async () => {
    if (!isUserLoggedIn()) return;

    try {
      setIsSyncing(true);
      const api = createAuthenticatedAxios();
      const response = await api.get(endpoints['my-cart']);
      
      let cartData = [];
      if (response.data?.items && Array.isArray(response.data.items)) {
        cartData = response.data.items;
      } else if (Array.isArray(response.data)) {
        cartData = response.data;
      }
      
      if (cartData.length >= 0) {
        const backendItems = cartData.map(item => ({
          id: item.medicine,
          name: item.medicine_name || 'Sản phẩm không có tên',
          price: item.medicine_price || 0,
          quantity: item.quantity || 1,
          total_price: item.total_price || 0,
          selected: true,
          image: item.medicine_images?.[0]?.imgMedicineUrl,
          genre: item.medicine_genre || "Không xác định",
          produce: item.medicine_produce || "Không xác định",
          cartItemId: item.id
        }));
        
        setCartItems(backendItems);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isUserLoggedIn]);

  // Load cart when component mounts
  useEffect(() => {
    const initCart = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      if (!token) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        await syncCartWithBackend();
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, [syncCartWithBackend]);

  // Auto-sync when user logs in
  useEffect(() => {
    let lastAuthState = !!(localStorage.getItem('token') || localStorage.getItem('userToken'));
    
    const checkAuthChange = () => {
      const currentAuthState = !!(localStorage.getItem('token') || localStorage.getItem('userToken'));
      
      // If user just logged in
      if (!lastAuthState && currentAuthState && !isLoading && !isSyncing) {
        syncCartWithBackend();
      }
      
      // If user logged out
      if (lastAuthState && !currentAuthState) {
        setCartItems([]);
      }
      
      lastAuthState = currentAuthState;
    };

    const interval = setInterval(checkAuthChange, 1000);
    return () => clearInterval(interval);
  }, [isLoading, isSyncing, syncCartWithBackend]);

  // Add item to cart
  const addToCart = useCallback(async (medicine, quantity = 1) => {
    if (!isUserLoggedIn()) {
      return { success: false, message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' };
    }

    if (!medicine?.id || quantity <= 0 || quantity > 99) {
      return { success: false, message: 'Dữ liệu sản phẩm không hợp lệ' };
    }

    try {
      setIsSyncing(true);
      const api = createAuthenticatedAxios();
      const response = await api.post(endpoints['add-to-cart'], {
        medicine: medicine.id,
        quantity: quantity
      });

      // Update local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === medicine.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > 99) return prevItems;
          
          return prevItems.map(item =>
            item.id === medicine.id
              ? { ...item, quantity: newQuantity, total_price: response.data?.total_price || ((item.price || 0) * newQuantity) }
              : item
          );
        } else {
          const newItem = {
            id: medicine.id,
            name: medicine.name || 'Sản phẩm không có tên',
            price: medicine.price || 0,
            quantity: quantity,
            total_price: response.data?.total_price || ((medicine.price || 0) * quantity),
            selected: true,
            image: medicine.images?.[0]?.imgMedicineUrl,
            genre: medicine.medicineGenre?.name || "Không xác định",
            produce: medicine.produce?.name || "Không xác định",
            cartItemId: response.data?.id
          };
          return [...prevItems, newItem];
        }
      });

      return { success: true, message: 'Đã thêm vào giỏ hàng', cartItemId: response.data?.id };
    } catch (error) {
      return { success: false, message: 'Lỗi khi thêm vào giỏ hàng' };
    } finally {
      setIsSyncing(false);
    }
  }, [isUserLoggedIn]);

  // Update quantity
  const updateQuantity = useCallback(async (id, newQuantity) => {
    if (!isUserLoggedIn()) {
      return { success: false, message: 'Vui lòng đăng nhập để cập nhật giỏ hàng' };
    }

    const cartItem = cartItems.find(item => item.id === id);
    if (!cartItem?.cartItemId) {
      return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
    }

    try {
      // Update UI optimistically first
      if (newQuantity <= 0) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      } else if (newQuantity <= 99) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity, total_price: (item.price || 0) * newQuantity } : item
          )
        );
      } else {
        return { success: false, message: 'Số lượng tối đa là 99' };
      }

      // Then sync with backend
      setIsSyncing(true);
      const api = createAuthenticatedAxios();
      
      if (newQuantity <= 0) {
        await api.delete(`${endpoints['cart-items']}${cartItem.cartItemId}/`);
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
      } else {
        const url = endpoints['update-cart-quantity'].replace('{itemId}', cartItem.cartItemId);
        await api.patch(url, { quantity: newQuantity });
      }

      return { success: true };
    } catch (error) {
      // Revert optimistic update on error
      await syncCartWithBackend();
      return { success: false, message: 'Lỗi khi cập nhật số lượng' };
    } finally {
      setIsSyncing(false);
    }
  }, [cartItems, isUserLoggedIn, syncCartWithBackend]);

  // Remove item from cart
  const removeFromCart = useCallback(async (id) => {
    if (!isUserLoggedIn()) {
      return { success: false, message: 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng' };
    }

    try {
      setIsSyncing(true);
      const cartItem = cartItems.find(item => item.id === id);
      if (!cartItem?.cartItemId) {
        return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
      }

      const api = createAuthenticatedAxios();
      await api.delete(`${endpoints['cart-items']}${cartItem.cartItemId}/`);
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      return { success: true, message: 'Đã xóa khỏi giỏ hàng' };
    } catch (error) {
      return { success: false, message: 'Lỗi khi xóa sản phẩm' };
    } finally {
      setIsSyncing(false);
    }
  }, [cartItems, isUserLoggedIn]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!isUserLoggedIn()) {
      setCartItems([]);
      return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' };
    }

    try {
      setIsSyncing(true);
      const api = createAuthenticatedAxios();
      const deletePromises = cartItems.map(item => {
        if (item.cartItemId) {
          return api.delete(`${endpoints['cart-items']}${item.cartItemId}/`);
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);
      setCartItems([]);
      return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' };
    } catch (error) {
      setCartItems([]);
      return { success: true, message: 'Đã xóa toàn bộ giỏ hàng (có lỗi đồng bộ)' };
    } finally {
      setIsSyncing(false);
    }
  }, [cartItems, isUserLoggedIn]);

  // Utility functions
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const getTotalAmount = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const itemTotal = item.total_price !== undefined ? item.total_price : ((item.price || 0) * item.quantity);
      return sum + itemTotal;
    }, 0);
  }, [cartItems]);

  const getSelectedAmount = useCallback(() => {
    return cartItems.filter(item => item.selected).reduce((sum, item) => {
      const itemTotal = item.total_price !== undefined ? item.total_price : ((item.price || 0) * item.quantity);
      return sum + itemTotal;
    }, 0);
  }, [cartItems]);

  const getSelectedItems = useCallback(() => {
    return cartItems.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const toggleItemSelection = useCallback((id) => {
    if (!isUserLoggedIn()) return;
    setCartItems(prevItems =>
      prevItems.map(item => item.id === id ? { ...item, selected: !item.selected } : item)
    );
  }, [isUserLoggedIn]);

  const selectAllItems = useCallback((selected = true) => {
    if (!isUserLoggedIn()) return;
    setCartItems(prevItems => prevItems.map(item => ({ ...item, selected })));
  }, [isUserLoggedIn]);

  const isAllSelected = useCallback(() => {
    return cartItems.length > 0 && cartItems.every(item => item.selected);
  }, [cartItems]);

  const getSelectedCartItems = useCallback(() => {
    return cartItems.filter(item => item.selected);
  }, [cartItems]);

  const isInCart = useCallback((id) => {
    return cartItems.some(item => item.id === id);
  }, [cartItems]);

  const getItemQuantity = useCallback((id) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Buy now - temporary cart for direct purchase
  const buyNow = useCallback((medicine, quantity = 1) => {
    if (!isUserLoggedIn()) {
      return { success: false, message: 'Vui lòng đăng nhập để mua hàng' };
    }

    if (!medicine?.id || quantity <= 0 || quantity > 99) {
      return { success: false, message: 'Dữ liệu sản phẩm không hợp lệ' };
    }

    // Store buy now item in localStorage for checkout page
    const buyNowItem = {
      id: medicine.id,
      name: medicine.name || 'Sản phẩm không có tên',
      price: medicine.price || 0,
      quantity: quantity,
      total_price: (medicine.price || 0) * quantity,
      selected: true,
      image: medicine.images?.[0]?.imgMedicineUrl || medicine.image,
      genre: medicine.genre?.name || "Không xác định",
      produce: medicine.produce?.name || "Không xác định",
      isBuyNow: true
    };

    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    return { success: true, message: 'Chuyển đến trang thanh toán' };
  }, [isUserLoggedIn]);

  // Reorder - buy again from order items  
  const reorderItems = useCallback((orderItems) => {
    if (!isUserLoggedIn()) {
      return { success: false, message: 'Vui lòng đăng nhập để mua lại' };
    }

    if (!orderItems || orderItems.length === 0) {
      return { success: false, message: 'Không có sản phẩm để mua lại' };
    }

    // Convert order items to buy now format
    const reorderItemsFormatted = orderItems.map(item => ({
      id: item.medicine || item.medicine_id || item.id,
      name: item.medicine_name || item.name || 'Sản phẩm không có tên',
      price: item.price || 0,
      quantity: item.quantity || 1,
      total_price: (item.price || 0) * (item.quantity || 1),
      selected: true,
      image: item.medicine_image || item.image,
      genre: "Không xác định",
      produce: "Không xác định",
      isBuyNow: true
    }));

    localStorage.setItem('buyNowItem', JSON.stringify(reorderItemsFormatted));
    return { success: true, message: 'Chuyển đến trang thanh toán' };
  }, [isUserLoggedIn]);

  const value = {
    // State
    cartItems,
    isLoading,
    isSyncing,
    
    // Actions
    addToCart,
    buyNow,
    reorderItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCartWithBackend,
    
    // Getters
    getTotalItems,
    getTotalAmount,
    isInCart,
    getItemQuantity,
    
    // Selection functions
    getSelectedAmount,
    getSelectedItems,
    toggleItemSelection,
    selectAllItems,
    isAllSelected,
    getSelectedCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
