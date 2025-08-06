import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import MedicineList from "../features/Medicine/MedicineList";
import Base from "../ui/Base";
import Spinner from "../ui/Spinner";
import MedicineGenre from "../features/MedicineGenre/MedicineGenre";
import FilterPanel from "../ui/FilterPanel";
import Pagination from "../ui/Pagination";
import ProduceList from "../features/Produce/ProduceList";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Alert, Button } from "react-bootstrap";
import axios, { endpoints } from "../utils/axiosConfig";

const Medicine = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGenres, setShowGenres] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const min_price = searchParams.get("min_price") || "";
  const max_price = searchParams.get("max_price") || "";
  const produce = searchParams.get("produce") || "";
  const genre = searchParams.get("genre") || "";
  const q = searchParams.get("q") || "";

  useEffect(() => {
    setMinPrice(min_price);
    setMaxPrice(max_price);
    setBrand(produce);
    setSearchQuery(q);
  }, [min_price, max_price, produce, q]);

  const loadMedicines = async () => {
    setLoading(true);
    let url = `${endpoints.medicines}?page=${page}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (produce) url += `&produce=${produce}`;
    if (min_price) url += `&min_price=${min_price}`;
    if (max_price) url += `&max_price=${max_price}`;
    if (genre) url += `&medicineGenre=${genre}`;

    try {
      const res = await axios.get(url);
      const data = res.data || {};
      let results = Array.isArray(data.results) ? data.results : [];

      setMedicines(results);

      const totalItems = data.count || 0;
      const pageSize = data.page_size || 10;
      setTotalPages(Math.ceil(totalItems / pageSize));
    } catch (err) {
      setMedicines([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, [page, q, produce, min_price, max_price, genre]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  const updatePriceParams = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (min) newParams.set("min_price", min);
    else newParams.delete("min_price");

    if (max) newParams.set("max_price", max);
    else newParams.delete("max_price");

    setSearchParams(newParams);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    newParams.set("page", "1");
    if (brand) newParams.set("produce", brand);
    if (minPrice) newParams.set("min_price", minPrice);
    if (maxPrice) newParams.set("max_price", maxPrice);
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Only reset to page 1 if search query actually changed
    const currentQuery = q || "";
    const newQuery = searchQuery.trim();
    
    if (currentQuery === newQuery) {
      // Search query hasn't changed, don't reset page
      return;
    }
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    if (newQuery) {
      newParams.set("q", newQuery);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

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
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
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
