import React from 'react';
import LoadingSpinner from '../../ui/LoadingSpinner';
import MedicineList from '../Medicine/MedicineList';
import Pagination from '../../ui/Pagination';
import MedicineSearch from './MedicineSearch';

const MedicineSelection = ({ 
  searchQuery,
  setSearchQuery,
  selectedGenre,
  handleGenreChange,
  genres,
  handleKeyPress,
  handleSalesSearch,
  loading,
  medicines,
  addToSalesCart,
  page,
  totalPages,
  handlePageChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách thuốc</h2>
      
      <MedicineSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
        genres={genres}
        handleKeyPress={handleKeyPress}
        handleSalesSearch={handleSalesSearch}
      />

      {/* Medicine List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <MedicineList 
            medicines={medicines} 
            onMedicineSelect={addToSalesCart}
          />
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default MedicineSelection;
