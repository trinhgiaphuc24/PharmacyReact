import React from "react";

const ProduceList = ({ produces, loading, error, selected, onSelect }) => {
  if (loading) return <div>Đang tải nơi sản xuất...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl">
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="radio"
            name="produce"
            value=""
            checked={selected === ""}
            onChange={() => onSelect("")}
          />{" "}
          Tất cả
        </label>
        {produces.map((produce) => (
          <label key={produce.id}>
            <input
              type="radio"
              name="produce"
              value={produce.name}
              checked={selected === produce.name}
              onChange={() => onSelect(produce.name)}
            />{" "}
            {produce.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProduceList;
