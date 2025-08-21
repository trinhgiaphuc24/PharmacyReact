import React from 'react';
import { Link } from 'react-router-dom';
import InputField from '../../ui/InputField';
import SubmitButton from '../../ui/SubmitButton';

const LoginForm = ({ formData, isLoading, onInputChange, onSubmit }) => {
  const userIcon = (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
    </svg>
  );

  const passwordIcon = (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm-3 2h10v6H5v-6z"></path>
    </svg>
  );

  return (
    <div className="flex-1 p-10 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">Đăng nhập</h2>
      <div className="h-1 w-16 bg-green-700 mb-8 rounded" />

      <form onSubmit={onSubmit} className="space-y-6">
        <InputField
          label="Tên đăng nhập"
          type="text"
          placeholder="Nhập tên đăng nhập"
          value={formData.username}
          onChange={e => onInputChange('username', e.target.value)}
          icon={userIcon}
          required
        />

        <InputField
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={e => onInputChange('password', e.target.value)}
          icon={passwordIcon}
          required
        />

        <div className="flex justify-between items-center">
          <Link to="#" className="text-green-700 text-sm hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <SubmitButton isLoading={isLoading} loadingText="Đang đăng nhập...">
          Đăng nhập
        </SubmitButton>
      </form>
      
      <div className="mt-6 text-center text-gray-600">
        Bạn chưa có tài khoản? 
        <Link to="/register" className="text-green-700 font-semibold hover:underline ml-1">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
