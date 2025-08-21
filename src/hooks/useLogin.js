import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const useLogin = () => {
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

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit
  };
};
