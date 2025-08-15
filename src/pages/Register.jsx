import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { defaultUserRegister } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { username, password, confirmPassword, first_name, last_name } = formData;
    
    if (!username.trim()) {
      showError("Vui lòng nhập tên đăng nhập");
      return false;
    }
    
    if (!first_name.trim()) {
      showError("Vui lòng nhập họ");
      return false;
    }
    
    if (!last_name.trim()) {
      showError("Vui lòng nhập tên");
      return false;
    }
    
    if (!password) {
      showError("Vui lòng nhập mật khẩu");
      return false;
    }
    
    if (password !== confirmPassword) {
      showError("Mật khẩu xác nhận không khớp");
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare data for API (exclude confirmPassword and add null values for missing fields)
      const { confirmPassword, ...registrationData } = formData;
      
      // Add null values for email and phone_number as required by backend
      const dataToSend = {
        ...registrationData,
        email: null,
        phone_number: null
      };
      
      await defaultUserRegister(dataToSend);
      
      showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("Registration error:", error);
      showError(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-700">
      <div className="bg-white rounded-xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Đăng ký</h2>
          <div className="h-1 w-16 bg-green-700 mb-8 rounded" />
          <form className="space-y-6">
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
                />
              </div>
            </div>
            
            {/* Họ và Tên - 1 hàng 2 cột */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Họ</label>
                <div className="flex items-center border-b border-gray-300 py-2">
                  <span className="text-green-700 mr-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
                  </span>
                  <input 
                    type="text" 
                    className="w-full outline-none bg-transparent" 
                    placeholder="Nhập họ" 
                    value={formData.first_name} 
                    onChange={e => handleInputChange('first_name', e.target.value)} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Tên</label>
                <div className="flex items-center border-b border-gray-300 py-2">
                  <span className="text-green-700 mr-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
                  </span>
                  <input 
                    type="text" 
                    className="w-full outline-none bg-transparent" 
                    placeholder="Nhập tên" 
                    value={formData.last_name} 
                    onChange={e => handleInputChange('last_name', e.target.value)} 
                  />
                </div>
              </div>
            </div>
            
            {/* Mật khẩu và Xác nhận mật khẩu - 1 hàng 2 cột */}
            <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <div className="flex items-center border-b border-gray-300 py-2">
                  <span className="text-green-700 mr-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm-3 2h10v6H5v-6z"></path></svg>
                  </span>
                  <input 
                    type="password" 
                    className="w-full outline-none bg-transparent" 
                    placeholder="Xác nhận mật khẩu" 
                    value={formData.confirmPassword} 
                    onChange={e => handleInputChange('confirmPassword', e.target.value)} 
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="button" 
              className={`w-full font-semibold py-3 rounded-lg transition ${
                isLoading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-green-700 hover:bg-green-800 text-white'
              }`}
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-600">
            Bạn đã có tài khoản? <Link to="/login" className="text-green-700 font-semibold hover:underline">Đăng nhập</Link>
          </div>
        </div>
        {/* Right: Image & Quote */}
        <div className="flex-1 bg-green-700 flex flex-col items-center justify-center relative">
          {/* <div className="absolute inset-0 bg-black bg-opacity-20" /> */}
          <img 
            src="https://images.pexels.com/photos/7615574/pexels-photo-7615574.jpeg" 
            className="w-full h-full object-cover absolute inset-0" 
            alt="Pharmacy background"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
