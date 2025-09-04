import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios, { endpoints } from "../utils/axiosConfig";

export const useStaffMedicine = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [genreLoading, setGenreLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const genre = searchParams.get("genre") || "";
  const q = searchParams.get("q") || "";
  const medicine_id = searchParams.get("medicine_id") || "";

  useEffect(() => {
    setSearchQuery(q || medicine_id);
    setSelectedGenre(genre);
  }, [q, genre, medicine_id]);

  useEffect(() => {
    axios.get(endpoints["medicine-genres"])
      .then((res) => {
        setGenres(res.data);
        setGenreLoading(false);
      })
      .catch(() => {
        setGenres([]);
        setGenreLoading(false);
      });
  }, []);

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    let url = `${endpoints.medicines}?page=${page}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (medicine_id) url += `&medicine_id=${medicine_id}`;
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
  }, [page, q, medicine_id, genre]);
  
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

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    updateParams({
      genre: selectedGenre
    });
  };

  const handleGenreChange = (genreValue) => {
    setSelectedGenre(genreValue);
    updateParams({
      genre: genreValue || undefined
    });
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const currentQuery = q || medicine_id || "";
    const newQuery = searchQuery.trim();
    
    if (currentQuery === newQuery) {
      return;
    }

    // Kiểm tra nếu là số thì search theo medicine_id, không thì search theo tên
    const isNumeric = /^\d+$/.test(newQuery);
    if (isNumeric && newQuery) {
      updateParams({ 
        medicine_id: newQuery,
        q: undefined 
      });
    } else {
      updateParams({ 
        q: newQuery || undefined,
        medicine_id: undefined 
      });
    }
  };

  // Function để cập nhật medicine trong state
  const updateMedicineInState = (medicineId, updatedData) => {
    setMedicines(prevMedicines => 
      prevMedicines.map(medicine => 
        medicine.id === medicineId 
          ? { ...medicine, ...updatedData }
          : medicine
      )
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    loading,
    medicines,
    setMedicines,
    totalPages,
    page,
    genres,
    genreLoading,
    
    handlePageChange,
    updateParams,
    handleFilterSubmit,
    handleSearchSubmit,
    handleGenreChange,
    setSearchParams,
    updateMedicineInState
  };
};
