import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios, { endpoints } from "../utils/axiosConfig";

export const useMedicineDetail = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [tab, setTab] = useState("Thành phần");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios.get(`${endpoints.medicines}/${id}/`)
      .then(res => setMedicine(res.data))
      .catch(() => setMedicine(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity(q => {
      const newQuantity = q + delta;
      const maxQuantity = medicine?.quantity || 1;
      return Math.max(1, Math.min(newQuantity, maxQuantity));
    });
  };

  const incrementQuantity = () => handleQuantityChange(1);
  const decrementQuantity = () => handleQuantityChange(-1);

  return {
    medicine,
    loading,
    selectedImg,
    setSelectedImg,
    tab,
    setTab,
    quantity,
    setQuantity,
    incrementQuantity,
    decrementQuantity
  };
};
