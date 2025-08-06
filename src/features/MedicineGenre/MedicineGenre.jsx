import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios, { endpoints } from "../../utils/axiosConfig";

const MedicineGenre = () => {
  const [genres, setGenres] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGenre = searchParams.get("genre");

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
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1"); 
    if (selectedGenre === genreId.toString()) {
      newParams.delete("genre");
    } else {
      newParams.set("genre", genreId);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="m-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Danh sách genres từ API */}
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