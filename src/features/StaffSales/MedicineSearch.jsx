import React from 'react';
import { Search } from 'lucide-react';

const MedicineSearch = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedGenre, 
  handleGenreChange, 
  genres, 
  handleKeyPress, 
  handleSalesSearch 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full py-2 px-3 pr-10 border border-gray-300 rounded-lg outline-none focus:border-green-600"
          placeholder="Tìm theo tên hoặc mã ID..."
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
          onClick={handleSalesSearch}
        />
      </div>
      
      {/* Medicine Type Filter */}
      <select
        value={selectedGenre}
        onChange={(e) => handleGenreChange(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-lg outline-none focus:border-green-600"
      >
        <option value="">Tất cả loại thuốc</option>
        {genres?.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MedicineSearch;
