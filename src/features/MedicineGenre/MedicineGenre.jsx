import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios, { endpoints } from "../../utils/axiosConfig";

const MedicineGenre = () => {
  const [genres, setGenres] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show selected state when we're on /medicines page
  const selectedGenre = location.pathname === '/medicines' ? searchParams.get("genre") : null;

  useEffect(() => {
    axios
      .get(endpoints["medicine-genres"])
      .then((res) => {
        setGenres(res.data);
      })
      .catch(() => {
        setGenres([]);
      });
  }, []);

  const handleGenreClick = (genreId) => {
    const newParams = new URLSearchParams();
    newParams.set("page", "1"); 
    
    if (selectedGenre === genreId.toString()) {
      // If already selected, just go to medicines page without genre filter
      navigate("/medicines?page=1");
    } else {
      // Navigate to medicines page with genre filter
      newParams.set("genre", genreId);
      navigate(`/medicines?${newParams.toString()}`);
    }
  };

  return (
    <div className="m-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {genres.map((genre) => (
        <div
          key={genre.id}
          className={`bg-white p-4 rounded-lg text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-3 ${
            selectedGenre === genre.id.toString() ? "ring-2 ring-green-500 bg-green-50" : ""
          }`}
          onClick={() => handleGenreClick(genre.id)}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <img
              src={genre.imgMedicineGenreUrl}
              alt={genre.name}
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="text-sm font-medium text-gray-700 text-left">
            {genre.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicineGenre;