import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  const [lastSync, setLastSync] = useState(null);

  // Constants
  const CART_STORAGE_KEY = 'pharmacy_cart';
  const CART_SYNC_KEY = 'pharmacy_cart_sync';
  const MAX_CART_ITEMS = 50; // Giới hạn số lượng sản phẩm trong giỏ

  // Load cart from localStorage with error handling
  const loadCartFromStorage = useCallback(() => {
    try {
      // Check if user is logged in
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedSync = localStorage.getItem(CART_SYNC_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart data structure
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart.slice(0, MAX_CART_ITEMS)); // Limit items
        }
      }
      
      if (savedSync) {
        setLastSync(new Date(savedSync));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(CART_SYNC_KEY);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage with error handling
  const saveCartToStorage = useCallback((items) => {
    try {
      // Check if user is logged in
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        return;
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(CART_SYNC_KEY, new Date().toISOString());
      setLastSync(new Date());
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      // Handle storage quota exceeded
      if (error.name === 'QuotaExceededError') {
        // Clear old data and try again
        localStorage.clear();
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (retryError) {
          console.error('Failed to save cart after clearing storage:', retryError);
        }
      }
    }
  }, []);

  // Load cart when component mounts
  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  // Save cart whenever cartItems changes
  useEffect(() => {
    if (!isLoading && cartItems.length >= 0) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, isLoading, saveCartToStorage]);

  // Listen for storage changes (sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const newCart = JSON.parse(e.newValue);
          if (Array.isArray(newCart)) {
            setCartItems(newCart);
          }
        } catch (error) {
          console.error('Error syncing cart across tabs:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Clear cart when user logs out
  useEffect(() => {
    const checkAuthStatus = () => {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        // User is logged out, clear cart
        setCartItems([]);
        try {
          localStorage.removeItem(CART_STORAGE_KEY);
          localStorage.removeItem(CART_SYNC_KEY);
        } catch (error) {
          console.error('Error clearing cart on logout:', error);
        }
        setLastSync(null);
      }
    };

    // Check immediately
    checkAuthStatus();

    // Listen for storage changes to detect logout
    const handleStorageChange = (e) => {
      if (e.key === 'userToken') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add item to cart with validation
  const addToCart = useCallback((medicine, quantity = 1) => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      return { success: false, message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' };
    }

    if (!medicine || !medicine.id) {
      console.error('Invalid medicine data');
      return { success: false, message: 'Dữ liệu sản phẩm không hợp lệ' };
    }

    if (quantity <= 0 || quantity > 99) {
      return { success: false, message: 'Số lượng không hợp lệ' };
    }

    setCartItems(prevItems => {
      // Check cart size limit
      if (prevItems.length >= MAX_CART_ITEMS) {
        return prevItems;
      }

      const existingItem = prevItems.find(item => item.id === medicine.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > 99) {
          return prevItems; // Don't exceed max quantity per item
        }
        
        return prevItems.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          id: medicine.id,
          name: medicine.name || 'Sản phẩm không có tên',
          price: medicine.price || 0,
          quantity: quantity,
          selected: true, // Mặc định chọn sản phẩm mới thêm
          image: medicine.images && medicine.images.length > 0 
            ? medicine.images[0].imgMedicineUrl 
            : "https://via.placeholder.com/100x100?text=No+Image",
          genre: medicine.medicineGenre?.name || "Không xác định",
          produce: medicine.produce?.name || "Không xác định",
          addedAt: new Date().toISOString()
        };
        return [...prevItems, newItem];
      }
    });

    return { success: true, message: 'Đã thêm vào giỏ hàng' };
  }, []);

  // Update item quantity with validation
  const updateQuantity = useCallback((id, newQuantity) => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      return { success: false, message: 'Vui lòng đăng nhập để cập nhật giỏ hàng' };
    }

    if (newQuantity <= 0) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      return;
    }

    if (newQuantity > 99) {
      return { success: false, message: 'Số lượng tối đa là 99' };
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    return { success: true };
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((id) => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      return { success: false, message: 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng' };
    }

    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    return { success: true, message: 'Đã xóa khỏi giỏ hàng' };
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' };
  }, []);

  // Get total items count
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Get total amount
  const getTotalAmount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Get selected items total amount
  const getSelectedAmount = useCallback(() => {
    return cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Get selected items count
  const getSelectedItems = useCallback(() => {
    return cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Toggle item selection
  const toggleItemSelection = useCallback((id) => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  // Select all items
  const selectAllItems = useCallback((selected = true) => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected }))
    );
  }, []);

  // Check if all items are selected
  const isAllSelected = useCallback(() => {
    return cartItems.length > 0 && cartItems.every(item => item.selected);
  }, [cartItems]);

  // Get selected cart items
  const getSelectedCartItems = useCallback(() => {
    return cartItems.filter(item => item.selected);
  }, [cartItems]);

  // Check if item is in cart
  const isInCart = useCallback((id) => {
    return cartItems.some(item => item.id === id);
  }, [cartItems]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((id) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Get cart summary
  const getCartSummary = useCallback(() => {
    return {
      totalItems: getTotalItems(),
      totalAmount: getTotalAmount(),
      itemCount: cartItems.length,
      lastSync: lastSync,
      isEmpty: cartItems.length === 0
    };
  }, [cartItems, getTotalItems, getTotalAmount, lastSync]);

  // Export cart data (for backup/sync)
  const exportCart = useCallback(() => {
    return {
      items: cartItems,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
  }, [cartItems]);

  // Import cart data (for restore/sync)
  const importCart = useCallback((cartData) => {
    try {
      if (cartData && Array.isArray(cartData.items)) {
        setCartItems(cartData.items.slice(0, MAX_CART_ITEMS));
        return { success: true, message: 'Đã khôi phục giỏ hàng' };
      }
      return { success: false, message: 'Dữ liệu giỏ hàng không hợp lệ' };
    } catch (error) {
      console.error('Error importing cart:', error);
      return { success: false, message: 'Lỗi khi khôi phục giỏ hàng' };
    }
  }, []);

  const value = {
    // State
    cartItems,
    isLoading,
    lastSync,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    
    // Getters
    getTotalItems,
    getTotalAmount,
    isInCart,
    getItemQuantity,
    getCartSummary,
    
    // Selection functions
    getSelectedAmount,
    getSelectedItems,
    toggleItemSelection,
    selectAllItems,
    isAllSelected,
    getSelectedCartItems,
    
    // Advanced features
    exportCart,
    importCart,
    
    // Constants
    MAX_CART_ITEMS
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
