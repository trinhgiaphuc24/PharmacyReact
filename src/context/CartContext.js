import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createAuthenticatedAxios, endpoints } from '../utils/axiosConfig';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isCustomer } = useAuth(); 

  const isUserLoggedIn = useCallback(() => {
    return !!user?.token;
  }, [user]);

  const syncCartWithBackend = useCallback(async () => {
    if (!isUserLoggedIn() || !isCustomer()) {
      return;
    }

    const api = createAuthenticatedAxios();
    const response = await api.get(endpoints['my-cart']);
    
    let cartData = response.data.items;
    
    if (cartData && cartData.length > 0) {
      const backendItems = cartData.map(item => {
        const stockValue = item.medicine_stock ?? 0;
        console.log(`Item ${item.medicine_name}: stock = ${stockValue} (original: ${item.medicine_stock}), quantity = ${item.quantity}`); // Debug log
        
        return {
          id: item.medicine,
          name: item.medicine_name,
          price: item.medicine_price,
          quantity: item.quantity,
          total_price: item.total_price,
          selected: stockValue > 0, 
          image: item.medicine_images?.[0]?.imgMedicineUrl,
          genre: item.medicine_genre,
          produce: item.medicine_produce,
          cartItemId: item.id,
          stock: stockValue 
        };
      });
      
      setCartItems(backendItems);
    } else {
      setCartItems([]);
    }
  }, [isUserLoggedIn, isCustomer]);

  useEffect(() => {
    const initCart = async () => {
      if (!isUserLoggedIn() || !isCustomer()) {
        setCartItems([]);
        return;
      }
      
      setIsLoading(true);
      await syncCartWithBackend();
      setIsLoading(false);
    };

    initCart();
  }, [syncCartWithBackend, isUserLoggedIn, isCustomer, user]);

  const addToCart = useCallback(async (medicine, quantity = 1) => {
    if (!isUserLoggedIn() || !isCustomer()) {
      return { success: false, message: 'Vui lòng đăng nhập với tài khoản khách hàng để thêm sản phẩm vào giỏ hàng' };
    }

    try {
      const api = createAuthenticatedAxios();
      const response = await api.post(endpoints['add-to-cart'], {
        medicine: medicine.id,
        quantity: quantity
      });

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === medicine.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          
          return prevItems.map(item =>
            item.id === medicine.id
              ? { ...item, quantity: newQuantity, total_price: response.data?.total_price}
              : item
          );
        } else {
          const newItem = {
            id: medicine.id,
            name: medicine.name,
            price: medicine.price,
            quantity: quantity,
            total_price: response.data?.total_price,
            selected: true,
            image: medicine.images?.[0]?.imgMedicineUrl,
            genre: medicine.medicineGenre?.name,
            produce: medicine.produce?.name,
            cartItemId: response.data?.id,
            stock: medicine.quantity || 0
          };
          return [...prevItems, newItem];
        }
      });

      return { success: true, message: 'Đã thêm vào giỏ hàng', cartItemId: response.data?.id };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể thêm sản phẩm vào giỏ hàng';
      return { success: false, message: errorMessage };
    }
  }, [isUserLoggedIn, isCustomer]);

  const updateQuantity = useCallback(async (id, newQuantity) => {
    const cartItem = cartItems.find(item => item.id === id);
    if (!cartItem?.cartItemId) {
      return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
    }

    try {
      const api = createAuthenticatedAxios();
      
      if (newQuantity <= 0) {
        await api.delete(`${endpoints['cart-items']}${cartItem.cartItemId}/`);
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
      } else {
        const url = endpoints['update-cart-quantity'].replace('{itemId}', cartItem.cartItemId);
        await api.patch(url, { quantity: newQuantity });
        
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity, total_price: (item.price) * newQuantity } : item
          )
        );
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể cập nhật số lượng sản phẩm';
      return { success: false, message: errorMessage };
    }
  }, [cartItems]);

  const removeFromCart = useCallback(async (id) => {
    const cartItem = cartItems.find(item => item.id === id);
    const api = createAuthenticatedAxios();
    await api.delete(`${endpoints['cart-items']}${cartItem.cartItemId}/`);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    return { success: true, message: 'Đã xóa khỏi giỏ hàng' };
  }, [cartItems]);

  const clearCart = useCallback(async () => {
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
  }, [cartItems]);

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
    if (!isUserLoggedIn() || !isCustomer()) return;
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const isOutOfStock = item.stock === 0;
          
          if (isOutOfStock) {
            return item; 
          }
          
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  }, [isUserLoggedIn, isCustomer]);

  const selectAllItems = useCallback((selected = true) => {
    if (!isUserLoggedIn() || !isCustomer()) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => {
        // Only prevent selection for completely out of stock items
        const isOutOfStock = item.stock === 0;
        
        if (isOutOfStock) {
          return { ...item, selected: false }; // Force unselect out of stock items
        }
        
        return { ...item, selected };
      })
    );
  }, [isUserLoggedIn, isCustomer]);

  const isAllSelected = useCallback(() => {
    const selectableItems = cartItems.filter(item => {
      const isOutOfStock = item.stock === 0;
      return !isOutOfStock;
    });
    
    return selectableItems.length > 0 && selectableItems.every(item => item.selected);
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

  const buyNow = useCallback((medicine, quantity = 1) => {
    if (!isUserLoggedIn() || !isCustomer()) {
      return { success: false, message: 'Vui lòng đăng nhập với tài khoản khách hàng để mua hàng' };
    }
    if (medicine.quantity < quantity) {
      return { 
        success: false, 
        message: `Không đủ hàng cho thuốc ${medicine.name}. Còn lại: ${medicine.quantity}` 
      };
    }

    const buyNowItem = {
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: quantity,
      total_price: medicine.price * quantity,
      selected: true,
      image: medicine.images?.[0]?.imgMedicineUrl,
      genre: medicine.genre?.name,
      produce: medicine.produce?.name,
      isBuyNow: true
    };

    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    return { success: true, message: 'Chuyển đến trang thanh toán' };
  }, [isUserLoggedIn, isCustomer]);

  const reorderItems = useCallback((orderItems) => {
    if (!isUserLoggedIn() || !isCustomer()) {
      return { success: false, message: 'Vui lòng đăng nhập với tài khoản khách hàng để mua lại' };
    }

    if (!orderItems || orderItems.length === 0) {
      return { success: false, message: 'Không có sản phẩm để mua lại' };
    }

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
  }, [isUserLoggedIn, isCustomer]);

  const value = {
    cartItems,
    isLoading,
    addToCart,
    buyNow,
    reorderItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCartWithBackend,
    getTotalItems,
    getTotalAmount,
    isInCart,
    getItemQuantity,
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
