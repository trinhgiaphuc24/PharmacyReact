import React from 'react';
import { Search } from 'lucide-react';

const InventorySearch = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedGenre, 
  handleGenreChange, 
  genres, 
  handleKeyPress, 
  handleSearch 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tìm kiếm và lọc</h2>
      
      <div className="space-y-4">
        {/* Search - First Row */}
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
            onClick={handleSearch}
          />
        </div>
        
        {/* Medicine Type Filter - Second Row */}
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
    </div>
  );
};

export default InventorySearch;
