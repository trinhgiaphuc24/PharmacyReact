import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios, { endpoints } from "../utils/axiosConfig";

const Header = ({
  searchQuery,
  setSearchQuery,
  medicineGenres = [],
  onSearchSubmit,
}) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isStaff, isCustomer, logout } = useAuth();
  const cartCount = getTotalItems();
  const [showMedicineGenreMenu, setShowMedicineGenreMenu] = useState(false);
  const [genres, setGenres] = useState([]);

  // Kiểm tra trạng thái đăng nhập từ AuthContext
  const isLoggedIn = isAuthenticated();
  const userIsStaff = isStaff();
  const userIsCustomer = isCustomer();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Lấy dữ liệu medicine genres từ API
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

  const handleSearch = () => {
    if (onSearchSubmit) {
      // If we're on a page that provides custom search handling, use it
      onSearchSubmit();
    } else {
      // Otherwise, navigate to medicines page with search query
      if (searchQuery.trim()) {
        navigate(`/medicines?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate("/medicines");
      }
    }
  };

  // Realtime search when user types
  useEffect(() => {
    if (onSearchSubmit && searchQuery !== undefined) {
      // Debounce search to avoid too many API calls
      const delayedSearch = setTimeout(() => {
        onSearchSubmit();
      }, 300); // 300ms delay

      return () => clearTimeout(delayedSearch);
    }
  }, [searchQuery, onSearchSubmit]);

  const handleGenreClick = (genreId) => {
    setShowMedicineGenreMenu(false);
    navigate(`/medicines?genre=${genreId}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-green-700 text-white px-30">
      <div className="max-w-5xl mx-auto px-5 flex items-center text-sm font-medium">
        <div
          className="flex items-center w-40 h-20 rounded-lg justify-center mr-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/logohome.png" alt="Logo" className="w-32 h-auto" />
        </div>

        {/* Thanh tìm kiếm - hiển thị cho tất cả người dùng trừ staff */}
        {!userIsStaff && (
          <div className="flex-1 max-w-2xl mx-10 mt-5">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full py-3 px-4 pr-12 border-2 border-gray-200 rounded-lg text-base outline-none focus:border-blue-500 transition-colors text-gray-800"
                placeholder="Bạn đang tìm gì hôm nay..."
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
          </div>
        )}

        {/* Spacer cho staff khi không có search bar */}
        {userIsStaff && <div className="flex-1"></div>}

        <div className="flex items-center gap-4">
          {/* Chuông thông báo - chỉ hiển thị khi đã đăng nhập */}
          {isLoggedIn && <Bell className="w-6 h-6 text-white cursor-pointer" />}

          {/* Chỉ hiển thị đơn hàng và giỏ hàng cho khách hàng */}

          {userIsCustomer && (
            <>
              <Package
                className="w-6 h-6 text-white cursor-pointer"
                onClick={() => navigate("/orders")}
                title="Đơn hàng của tôi"
              />
            </>
          )}

          {!userIsStaff && (
            <>
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Hiển thị nút dashboard cho staff */}
          {userIsStaff && (
            <div
              className="w-6 h-6 text-white cursor-pointer"
              onClick={() => navigate("/staff/dashboard")}
              title="Quản lý đơn hàng"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          )}

          {/* User section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.last_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg text-white text-sm hover:bg-red-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-green-700 text-sm hover:bg-gray-200 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Đăng nhập/Đăng ký</span>
            </a>
          )}
        </div>
      </div>
      {/* Navigation menu - hiển thị cho tất cả người dùng */}
      <div className="max-w-5xl mx-auto px-5 flex items-center text-sm font-medium">
        {/* Overlay when menu is open */}
        {showMedicineGenreMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40"></div>
        )}
        {/* Danh mục có dropdown */}
        <div className="relative z-50">
          <div
            className="flex items-center px-4 py-3 rounded-b-lg mr-8 font-medium cursor-pointer"
            onMouseEnter={() => setShowMedicineGenreMenu(true)}
            onMouseLeave={() => setShowMedicineGenreMenu(false)}
          >
            <Menu className="w-5 h-5 mr-2" />
            <span>Danh mục</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </div>
          {/* Dropdown danh mục */}
          {showMedicineGenreMenu && (
            <div
              className="absolute z-50 bg-white text-gray-800 shadow-xl top-full rounded-lg w-max min-w-[600px] p-6"
              onMouseEnter={() => setShowMedicineGenreMenu(true)}
              onMouseLeave={() => setShowMedicineGenreMenu(false)}
            >
              <div className="grid grid-cols-4 gap-6">
                {genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="flex flex-col items-center text-center hover:text-green-600 transition cursor-pointer group"
                    onClick={() => handleGenreClick(genre.id)}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
                      {genre.imgMedicineGenreUrl ? (
                        <img
                          src={genre.imgMedicineGenreUrl}
                          alt={genre.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">💊</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{genre.name}</span>
                  </div>
                ))}

                {/* Nếu không có dữ liệu từ API, hiển thị placeholder */}
                {genres.length === 0 && (
                  <div className="col-span-4 text-center text-gray-500 py-8">
                    Đang tải danh mục...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-8">
          <div
            className="py-3 font-medium cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/medicines")}
          >
            Thuốc
          </div>
          <div className="py-3 font-medium cursor-pointer hover:opacity-80 transition-opacity">
            Tra cứu bệnh
          </div>
          <div className="py-3 font-medium cursor-pointer hover:opacity-80 transition-opacity">
            Thực phẩm bảo vệ sức khỏe
          </div>
          <div className="py-3 font-medium cursor-pointer hover:opacity-80 transition-opacity">
            Mẹ và bé
          </div>
          <div className="py-3 font-medium cursor-pointer hover:opacity-80 transition-opacity relative">
            Nhãn hàng Gia Phúc
          </div>
          <div className="py-3 font-medium cursor-pointer hover:opacity-80 transition-opacity">
            Chăm sóc cá nhân
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
