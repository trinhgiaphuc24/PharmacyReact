import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { defaultUserLogin } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { username, password } = formData;
    
    if (!username.trim()) {
      showError("Vui lòng nhập tên đăng nhập");
      return false;
    }
    
    if (!password) {
      showError("Vui lòng nhập mật khẩu");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const userData = await defaultUserLogin(formData);
      showSuccess("Đăng nhập thành công!");
      
      const userRole = userData.userRole || userData.role || userData.user_role;
      
      if (userRole === "staff") {
        navigate('/staff/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error("Login error:", error);
      showError(error.message || "Tên đăng nhập hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-700">
      <div className="bg-white rounded-xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Đăng nhập</h2>
          <div className="h-1 w-16 bg-green-700 mb-8 rounded" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">Tên đăng nhập</label>
              <div className="flex items-center border-b border-gray-300 py-2">
                <span className="text-green-700 mr-2">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
                </span>
                <input 
                  type="text" 
                  className="w-full outline-none bg-transparent" 
                  placeholder="Nhập tên đăng nhập" 
                  value={formData.username} 
                  onChange={e => handleInputChange('username', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Mật khẩu</label>
              <div className="flex items-center border-b border-gray-300 py-2">
                <span className="text-green-700 mr-2">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm-3 2h10v6H5v-6z"></path></svg>
                </span>
                <input 
                  type="password" 
                  className="w-full outline-none bg-transparent" 
                  placeholder="Nhập mật khẩu" 
                  value={formData.password} 
                  onChange={e => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Link to="#" className="text-green-700 text-sm hover:underline">Quên mật khẩu?</Link>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full font-semibold py-3 rounded-lg transition ${
                isLoading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-green-700 hover:bg-green-800 text-white'
              }`}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-600">
            Bạn chưa có tài khoản? <Link to="/register" className="text-green-700 font-semibold hover:underline">Đăng ký ngay</Link>
          </div>
          
        </div>
        {/* Right: Image & Quote */}
        <div className="flex-1 bg-green-700 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <img src="https://images.pexels.com/photos/7615567/pexels-photo-7615567.jpeg" alt="login visual" className="w-full h-full object-cover absolute inset-0" />
        </div>
      </div>
    </div>
  );
};

export default Login;
