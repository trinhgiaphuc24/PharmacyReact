import React, { useState } from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import CustomerInfo from '../features/StaffSales/CustomerInfo';
import SalesCart from '../features/StaffSales/SalesCart';
import MedicineSelection from '../features/StaffSales/MedicineSelection';
import { useStaffMedicine } from '../hooks/useStaffMedicine';
import { useStaffSales } from '../hooks/useStaffSales';

const StaffSales = () => {
  const [customerInfo, setCustomerInfo] = useState({
    lastName: '',
    phoneNumber: ''
  });
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  // Sử dụng useStaffMedicine hook - riêng cho staff
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    loading,
    medicines,
    totalPages,
    page,
    handlePageChange,
    handleSearchSubmit,
    handleGenreChange,
    genres
  } = useStaffMedicine();

  // Hook để xử lý bán hàng
  const { isProcessing, createDirectSale } = useStaffSales();

  const addToSalesCart = (medicine) => {
    // Check stock availability first
    if (medicine.quantity <= 0) {
      alert('Sản phẩm này đã hết hàng');
      return;
    }

    const existingIndex = selectedMedicines.findIndex(item => item.id === medicine.id);
    
    if (existingIndex >= 0) {
      const currentItem = selectedMedicines[existingIndex];
      // Check if adding one more would exceed stock
      if (currentItem.cartQuantity >= medicine.quantity) {
        alert(`Kho chỉ còn ${medicine.quantity} sản phẩm`);
        return;
      }
      
      const updated = [...selectedMedicines];
      updated[existingIndex].cartQuantity += 1;
      setSelectedMedicines(updated);
    } else {
      setSelectedMedicines([...selectedMedicines, {
        ...medicine,
        stock: medicine.quantity, // Preserve original stock
        cartQuantity: 1 // Cart quantity
      }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromSalesCart(id);
      return;
    }
    
    // Find the medicine to check stock limits
    const medicine = selectedMedicines.find(item => item.id === id);
    if (medicine && newQuantity > medicine.stock) {
      alert(`Kho chỉ còn ${medicine.stock} sản phẩm`);
      return;
    }
    
    setSelectedMedicines(prevMedicines =>
      prevMedicines.map(item =>
        item.id === id ? { ...item, cartQuantity: newQuantity } : item
      )
    );
  };

  const removeFromSalesCart = (id) => {
    setSelectedMedicines(prevMedicines =>
      prevMedicines.filter(item => item.id !== id)
    );
  };

  const getTotalAmount = () => {
    return selectedMedicines.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const handleSalesSearch = () => {
    // Sử dụng search từ useMedicine
    handleSearchSubmit();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSalesSearch();
    }
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (selectedMedicines.length === 0) {
      alert('Vui lòng chọn ít nhất một thuốc');
      return;
    }

    if (!customerInfo.lastName || !customerInfo.phoneNumber) {
      alert('Vui lòng nhập đầy đủ thông tin khách hàng');
      return;
    }

    await createDirectSale(customerInfo, selectedMedicines);
  };

  // Đơn giản như trang StaffOrder - không cần authentication check phức tạp
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Bán hàng trực tiếp</h1>
        
        <div className="flex gap-8">
          {/* Left Panel - 35% */}
          <div className="w-1/3 space-y-6">
            <CustomerInfo 
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              isProcessing={isProcessing}
            />

            <SalesCart 
              selectedMedicines={selectedMedicines}
              updateQuantity={updateQuantity}
              removeFromSalesCart={removeFromSalesCart}
              getTotalAmount={getTotalAmount}
              handlePayment={handlePayment}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right Panel - 65% */}
          <div className="w-2/3 space-y-6">
            <MedicineSelection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGenre={selectedGenre}
              handleGenreChange={handleGenreChange}
              genres={genres}
              handleKeyPress={handleKeyPress}
              handleSalesSearch={handleSalesSearch}
              loading={loading}
              medicines={medicines}
              addToSalesCart={addToSalesCart}
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StaffSales;
