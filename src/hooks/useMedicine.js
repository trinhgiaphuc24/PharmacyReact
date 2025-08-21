import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios, { endpoints } from "../utils/axiosConfig";

export const useMedicine = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

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
  }, [page, q, produce, min_price, max_price, genre]); 

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
    
    const currentQuery = q || "";
    const newQuery = searchQuery.trim();
    
    if (currentQuery === newQuery) {
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

  return {
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
  };
};
