// src/components/Pagination/Pagination.jsx
import React from "react";
import { Button } from "react-bootstrap";

const Pagination = ({ page, totalPages, onChange }) => (
  <div className="flex gap-2 justify-center mt-6">
    {totalPages > 0 &&
      Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={page === i + 1 ? "success" : "outline-secondary"}
          className={`px-3 py-1 rounded ${
            page === i + 1 ? "bg-green-700 text-white" : "bg-white border"
          }`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
  </div>
);

export default Pagination;