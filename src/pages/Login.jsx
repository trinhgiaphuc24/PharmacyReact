import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Mock authentication - trong thực tế sẽ gọi API
      if (username === "s" && password === "123") {
        // Đăng nhập nhân viên
        localStorage.setItem('userToken', 'mock-staff-token');
        localStorage.setItem('userInfo', JSON.stringify({
          id: 1,
          username: 's',
          name: 'Staff',
          role: 'staff',
          email: 'staff@pharmacy.com'
        }));
        navigate('/staff/dashboard');
      } else if (username === "u" && password === "123") {
        // Đăng nhập khách hàng
        localStorage.setItem('userToken', 'mock-user-token');
        localStorage.setItem('userInfo', JSON.stringify({
          id: 2,
          username: 'u',
          name: 'User',
          role: 'customer',
          email: 'user@email.com'
        }));
        
        // Check if there's a redirect path stored
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/');
        }
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-700">
      <div className="bg-white rounded-xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Đăng nhập</h2>
          <div className="h-1 w-16 bg-green-700 mb-8 rounded" />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">Tên đăng nhập</label>
              <div className="flex items-center border-b border-gray-300 py-2">
                <span className="text-green-700 mr-2">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M2.94 6.94a8 8 0 1111.31 11.31A8 8 0 012.94 6.94zm1.42 1.42a6 6 0 108.49 8.49l-8.49-8.49zm9.19 9.19a6 6 0 01-8.49-8.49l8.49 8.49z"></path></svg>
                </span>
                <input 
                  type="text" 
                  className="w-full outline-none bg-transparent" 
                  placeholder="Nhập tên đăng nhập" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
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
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Link to="#" className="text-green-700 text-sm hover:underline">Quên mật khẩu?</Link>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
