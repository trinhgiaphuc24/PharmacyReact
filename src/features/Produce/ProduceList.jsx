import React, { useEffect, useState } from "react";
import axios, { endpoints } from "../../utils/axiosConfig";

const ProduceList = ({ value, onChange, setSearchParams }) => {
  const [produces, setProduces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    axios
      .get(endpoints.produces)
      .then((res) => {
        setProduces(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách nơi sản xuất");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    onChange(selected);

    const newParams = new URLSearchParams();
    if (selected) newParams.set("produce", selected);
    else newParams.delete("produce");
    newParams.set("page", "1");

    // Gọi từ prop để update query string luôn
    setSearchParams((prev) => {
      const merged = new URLSearchParams(prev);
      if (selected) merged.set("produce", selected);
      else merged.delete("produce");
      merged.set("page", "1");
      return merged;
    });
  }, [selected]);

  if (loading) return <div>Đang tải nơi sản xuất...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const filteredProduces = produces.filter((produce) =>
    produce.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl ">
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="radio"
            name="produce"
            value=""
            checked={selected === ""}
            onChange={() => setSelected("")}
          />{" "}
          Tất cả
        </label>
        {filteredProduces.map((produce) => (
          <label key={produce.id}>
            <input
              type="radio"
              name="produce"
              value={produce.name}
              checked={selected === produce.name}
              onChange={() => setSelected(produce.name)}
            />{" "}
            {produce.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProduceList;
