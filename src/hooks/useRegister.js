import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const useRegister = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      
      const dataToSend = {
        ...registrationData,
        email: null,
        phone_number: null
      };
      
      await defaultUserRegister(dataToSend);
      showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      
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

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit
  };
};
