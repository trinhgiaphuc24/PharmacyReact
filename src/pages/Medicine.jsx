import React, { useState } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import MedicineList from "../features/Medicine/MedicineList";
import Base from "../ui/Base";
import Spinner from "../ui/Spinner";
import MedicineGenre from "../features/MedicineGenre/MedicineGenre";
import FilterPanel from "../ui/FilterPanel";
import Pagination from "../ui/Pagination";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMedicine } from "../hooks/useMedicine";

const Medicine = () => {
  const [showGenres, setShowGenres] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    brand,
    setBrand,
    loading,
    medicines,
    totalPages,
    page,
    handlePageChange,
    updatePriceParams,
    handleFilterSubmit,
    handleSearchSubmit,
    setSearchParams
  } = useMedicine();

  if (loading && medicines.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50 font-sans">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className="py-8 p-20">
        <div className="max-w-6xl mx-auto px-20">
          <div className="flex items-center justify-between mb-6 p-2">
            <h2 className="text-xl font-bold text-green-700">Loại thuốc</h2>
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition flex items-center gap-2"
              onClick={() => setShowGenres((prev) => !prev)}
            >
              {showGenres ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          {showGenres && <MedicineGenre />}
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
            <FilterPanel
              minPrice={minPrice}
              maxPrice={maxPrice}
              brand={brand}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setBrand={setBrand}
              updatePriceParams={updatePriceParams}
              handleFilterSubmit={handleFilterSubmit}
              setSearchParams={setSearchParams}
            />
            <div className="lg:col-span-7">
              <MedicineList medicines={medicines} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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

export default Medicine;
