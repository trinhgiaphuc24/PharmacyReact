import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createAuthenticatedAxios, endpoints } from '../utils/axiosConfig';

export const useUserProfile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load user data khi component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const api = createAuthenticatedAxios();
        const response = await api.get(endpoints['current-user']);
        
        setFormData({
          username: response.data.username || '',
          email: response.data.email || '',
          phone_number: response.data.phone_number || '',
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || ''
        });
      } catch (error) {
        showError('Không thể tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Họ không được để trống';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Tên không được để trống';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (formData.phone_number && !/^[0-9]+$/.test(formData.phone_number)) {
        newErrors.phone_number = 'Số điện thoại chỉ được chứa chữ số';
    }

    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.current_password.trim()) {
      newErrors.current_password = 'Mật khẩu hiện tại không được để trống';
    }
    
    if (!passwordData.new_password.trim()) {
      newErrors.new_password = 'Mật khẩu mới không được để trống';
    } 
    
    if (!passwordData.confirm_password.trim()) {
      newErrors.confirm_password = 'Xác nhận mật khẩu không được để trống';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Mật khẩu xác nhận không khớp';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsUpdating(true);
    setErrors({});
    
    try {
      const api = createAuthenticatedAxios();
      
      console.log('Sending data:', formData); // Debug log
      
      // Gửi dữ liệu với Content-Type application/json
      const response = await api.patch(endpoints['current-user'], formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Update user context with new data
      const updatedUser = {
        ...user,
        ...response.data
      };
      updateUser(updatedUser);
      
      showSuccess('Cập nhật thông tin thành công!');
    } catch (error) {
      console.log('Update error:', error.response?.data); // Debug log
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          setErrors(errorData);
        } else {
          showError('Cập nhật thất bại: ' + JSON.stringify(errorData));
        }
      } else {
        showError('Cập nhật thất bại: ' + error.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validatePasswordForm();
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }
    
    setIsChangingPassword(true);
    setPasswordErrors({});
    
    try {
      const api = createAuthenticatedAxios();
      
      await api.patch(endpoints['current-user'], {
        current_password: passwordData.current_password,
        password: passwordData.new_password
      });
      
      showSuccess('Đổi mật khẩu thành công!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.log('Password change error:', error.response?.data);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          setPasswordErrors(errorData);
          showError('Đổi mật khẩu thất bại');
        } else {
          showError('Đổi mật khẩu thất bại: ' + JSON.stringify(errorData));
        }
      } else {
        showError('Đổi mật khẩu thất bại: ' + error.message);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    formData,
    isLoading,
    isUpdating,
    errors,
    handleChange,
    handleSubmit,
    // Password change
    passwordData,
    isChangingPassword,
    passwordErrors,
    handlePasswordChange,
    handlePasswordSubmit
  };
};
