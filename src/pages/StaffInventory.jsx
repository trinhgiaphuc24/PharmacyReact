import React from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import LoadingSpinner from '../ui/LoadingSpinner';
import Pagination from '../ui/Pagination';
import InventorySearch from '../features/StaffInventory/InventorySearch';
import InventoryMedicineList from '../features/StaffInventory/InventoryMedicineList';
import { useStaffMedicine } from '../hooks/useStaffMedicine';
import { useInventoryManagement } from '../hooks/useInventoryManagement';

const StaffInventory = () => {
  // Sử dụng useStaffMedicine hook để lấy danh sách thuốc
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
    genres,
    updateMedicineInState
  } = useStaffMedicine();

  // Hook để xử lý cập nhật tồn kho
  const { isUpdating, updateMedicineQuantity } = useInventoryManagement();

  const handleSearch = () => {
    handleSearchSubmit();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUpdateQuantity = async (medicineId, newQuantity) => {
    try {
      await updateMedicineQuantity(medicineId, newQuantity);
      // Cập nhật medicine trong state thay vì reload từ API
      updateMedicineInState(medicineId, { quantity: newQuantity });
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />
      
      <div className="container mx-auto px-2 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý tồn kho</h1>
        
        <div className="flex gap-6">
          {/* Left Panel - 30% - Search & Filter */}
          <div className="w-[30%]">
            <InventorySearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGenre={selectedGenre}
              handleGenreChange={handleGenreChange}
              genres={genres}
              handleKeyPress={handleKeyPress}
              handleSearch={handleSearch}
            />
          </div>

          {/* Right Panel - 70% - Medicine List */}
          <div className="w-[70%]">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Danh sách thuốc</h2>
              
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <InventoryMedicineList 
                    medicines={medicines}
                    onUpdateQuantity={handleUpdateQuantity}
                    isUpdating={isUpdating}
                  />
                  
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StaffInventory;
