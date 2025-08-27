// src/components/FilterPanel/FilterPanel.jsx
import React from "react";
import ProduceList from "../features/Produce/ProduceList";

const FilterPanel = ({
  minPrice,
  maxPrice,
  brand,
  setMinPrice,
  setMaxPrice,
  setBrand,
  updatePriceParams,
  handleFilterSubmit,
  setSearchParams,
  produces,
  produceLoading,
}) => {
  const handleProduceSelect = (produceName) => {
    setBrand(produceName);
    
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (produceName) {
        newParams.set("produce", produceName);
      } else {
        newParams.delete("produce");
      }
      newParams.set("page", "1");
      return newParams;
    });
  };
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-2">
      <h2 className="text-lg mb-4 text-green-700 text-xl font-bold">Bộ lọc</h2>
      <form className="flex flex-col gap-4" onSubmit={handleFilterSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-5">
            Khoảng giá
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 py-2 px-3 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 py-2 px-3 border rounded-lg"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-700 text-white py-2 rounded-lg font-semibold mt-2"
        >
          Áp dụng
        </button>
        <div>
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="radio"
                name="quickPrice"
                checked={minPrice === "" && maxPrice === ""}
                onChange={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  updatePriceParams("", "");
                }}
              />{" "}
              Tất cả
            </label>
            <label>
              <input
                type="radio"
                name="quickPrice"
                onChange={() => {
                  setMinPrice("");
                  setMaxPrice("100000");
                  updatePriceParams("", "100000");
                }}
              />{" "}
              Dưới 100.000 đ
            </label>
            <label>
              <input
                type="radio"
                name="quickPrice"
                onChange={() => {
                  setMinPrice("100000");
                  setMaxPrice("300000");
                  updatePriceParams("100000", "300000");
                }}
              />{" "}
              100.000 đ - 300.000 đ
            </label>
            <label>
              <input
                type="radio"
                name="quickPrice"
                onChange={() => {
                  setMinPrice("300000");
                  setMaxPrice("500000");
                  updatePriceParams("300000", "500000");
                }}
              />{" "}
              300.000 đ - 500.000 đ
            </label>
            <label>
              <input
                type="radio"
                name="quickPrice"
                onChange={() => {
                  setMinPrice("500000");
                  setMaxPrice("");
                  updatePriceParams("500000", "");
                }}
              />{" "}
              Trên 500.000 đ
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-5">
            Nơi sản xuất
          </label>
          <ProduceList
            produces={produces}
            loading={produceLoading}
            error={null}
            selected={brand}
            onSelect={handleProduceSelect}
          />
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;