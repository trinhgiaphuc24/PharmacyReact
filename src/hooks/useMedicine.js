import { useState, useEffect, useCallback } from "react";
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
  const [produces, setProduces] = useState([]);
  const [produceLoading, setProduceLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const min_price = searchParams.get("min_price") || "";
  const max_price = searchParams.get("max_price") || "";
  const produce = searchParams.get("produce") || "";
  const genre = searchParams.get("genre") || "";
  const q = searchParams.get("q") || "";

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  useEffect(() => {
    axios.get(endpoints.produces)
      .then((res) => {
        setProduces(res.data);
        setProduceLoading(false);
      })
      .catch(() => {
        setProduces([]);
        setProduceLoading(false);
      });
  }, []);

  const loadMedicines = useCallback(async () => {
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
  }, [page, q, produce, min_price, max_price, genre]);
  
  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]); 

  const updateParams = (newValues, resetPage = true) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (resetPage) {
      newParams.set("page", "1");
    }
    
    Object.entries(newValues).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage }, false);
  };

  const updatePriceParams = (min, max) => {
    updateParams({ min_price: min, max_price: max });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateParams({
      produce: brand,
      min_price: minPrice,
      max_price: maxPrice
    });
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
    
    updateParams({ q: newQuery || undefined });
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
    produces,
    produceLoading,
    
    handlePageChange,
    updateParams,
    updatePriceParams,
    handleFilterSubmit,
    handleSearchSubmit,
    setSearchParams
  };
};
