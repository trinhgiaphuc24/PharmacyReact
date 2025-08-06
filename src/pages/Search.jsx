// import React, { useState, useEffect } from "react";
// import { useLocation } from 'react-router-dom';
// import Header from "../ui/Header";
// import Footer from "../ui/Footer";
// import MedicineList from "../features/Medicine/MedicineList";
// import Base from "../ui/Base";
// import Spinner from "../ui/Spinner";
// import MedicineGenre from "../features/MedicineGenre/MedicineGenre";
// import ProduceList from "../features/Produce/ProduceList";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import axios, { endpoints } from "../utils/axiosConfig";

// const Pagination = ({ page, totalPages, onChange }) => (
//   <div className="flex gap-2 justify-center mt-6">
//     {Array.from({ length: totalPages }, (_, i) => (
//       <button
//         key={i + 1}
//         className={`px-3 py-1 rounded ${page === i + 1 ? "bg-green-700 text-white" : "bg-white border"}`}
//         onClick={() => onChange(i + 1)}
//       >
//         {i + 1}
//       </button>
//     ))}
//   </div>
// );

// const Search = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [cartCount] = useState(1);
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [brand, setBrand] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showGenres, setShowGenres] = useState(false);
//   const [medicines, setMedicines] = useState([]);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const location = useLocation();

//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => setLoading(false), 1000);
//     return () => clearTimeout(timer);
//   }, [location.pathname]);

//   const loadMedicines = async () => {
//     setLoading(true);
//     let url = `${endpoints.medicines}?page=${page}`;
//     if (brand) url += `&produce=${brand}`;
//     try {
//       const res = await axios.get(url);
//       const data = res.data;
//       setMedicines(data.results);
//       const pageSize = data.results.length > 0 ? data.results.length : 1;
//       setTotalPages(Math.ceil(data.count / pageSize));
//     } catch {
//       setError("Không thể tải danh sách thuốc");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMedicines();
//   }, [brand, page]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white-50 font-sans">
//       <Header
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         cartCount={cartCount}
//       />
//       <div className="py-8 p-20">
//         <div className="max-w-6xl mx-auto px-20">
//           {/* Tiêu đề và nút ẩn/hiện loại thuốc */}
//           <div className="flex items-center justify-between mb-6 p-2">
//             <h2 className="text-xl font-bold text-green-700">Loại thuốc</h2>
//             <button
//               className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition flex items-center gap-2"
//               onClick={() => setShowGenres((prev) => !prev)}
//             >
//               {showGenres ? (
//                 <>
//                   <FaChevronUp />
//                 </>
//               ) : (
//                 <>
//                   <FaChevronDown />
//                 </>
//               )}
//             </button>
//           </div>
//           {showGenres && <MedicineGenre />}
//           <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
//             {/* Filter Sidebar */}
//             <div className="lg:col-span-2 bg-white rounded-xl shadow p-2">
//               <h2 className="text-lg mb-4 text-green-700 text-xl font-bold">
//                 Bộ lọc
//               </h2>
//               <form className="flex flex-col gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-5">
//                     Khoảng giá
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="number"
//                       placeholder="Min"
//                       value={minPrice}
//                       onChange={(e) => setMinPrice(e.target.value)}
//                       className="w-1/2 py-2 px-3 border rounded-lg"
//                     />
//                     <input
//                       type="number"
//                       placeholder="Max"
//                       value={maxPrice}
//                       onChange={(e) => setMaxPrice(e.target.value)}
//                       className="w-1/2 py-2 px-3 border rounded-lg"
//                     />
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-green-700 text-white py-2 rounded-lg font-semibold mt-2"
//                 >
//                   Áp dụng
//                 </button>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-5">
//                     Khoảng giá nhanh
//                   </label>
//                   <div className="flex flex-col gap-2">
//                     <label>
//                       <input type="radio" name="quickPrice" /> Dưới 100.000 đ
//                     </label>
//                     <label>
//                       <input type="radio" name="quickPrice" /> 100.000 đ -
//                       300.000 đ
//                     </label>
//                     <label>
//                       <input type="radio" name="quickPrice" /> 300.000 đ -
//                       500.000 đ
//                     </label>
//                     <label>
//                       <input type="radio" name="quickPrice" /> Trên 500.000 đ
//                     </label>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-5">
//                     Nơi sản xuất
//                   </label>
//                   <ProduceList value={brand} onChange={setBrand} />
//                 </div>
                
//               </form>
//             </div>
//             {/* Search Results */}
//             <div className="lg:col-span-7">
              
//               <MedicineList
//                 gridCols={4}
//                 medicines={medicines}
//               />
//               <Pagination page={page} totalPages={totalPages} onChange={setPage} />
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//       <Base />
//     </div>
//   );
// };

// export default Search;
