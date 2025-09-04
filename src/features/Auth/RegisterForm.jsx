import React from 'react';
import { Link } from 'react-router-dom';
import InputField from '../../ui/InputField';
import InputFieldGroup from '../../ui/InputFieldGroup';
import SubmitButton from '../../ui/SubmitButton';

const RegisterForm = ({ formData, isLoading, onInputChange, onSubmit }) => {
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

  const emailIcon = (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
    </svg>
  );

  const phoneIcon = (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
    </svg>
  );

  const nameFields = [
    {
      label: "Họ",
      placeholder: "Nhập họ",
      value: formData.first_name,
      onChange: e => onInputChange('first_name', e.target.value),
      icon: userIcon,
      required: true
    },
    {
      label: "Tên",
      placeholder: "Nhập tên",
      value: formData.last_name,
      onChange: e => onInputChange('last_name', e.target.value),
      icon: userIcon,
      required: true
    }
  ];

  const contactFields = [
    {
      label: "Email",
      type: "email",
      placeholder: "Nhập email",
      value: formData.email,
      onChange: e => onInputChange('email', e.target.value),
      icon: emailIcon,
      required: true
    },
    {
      label: "Số điện thoại",
      type: "tel",
      placeholder: "Nhập số điện thoại",
      value: formData.phone_number,
      onChange: e => onInputChange('phone_number', e.target.value),
      icon: phoneIcon,
      required: true
    }
  ];

  const passwordFields = [
    {
      label: "Mật khẩu",
      type: "password",
      placeholder: "Nhập mật khẩu",
      value: formData.password,
      onChange: e => onInputChange('password', e.target.value),
      icon: passwordIcon,
      required: true
    },
    {
      label: "Xác nhận mật khẩu",
      type: "password",
      placeholder: "Xác nhận mật khẩu",
      value: formData.confirmPassword,
      onChange: e => onInputChange('confirmPassword', e.target.value),
      icon: passwordIcon,
      required: true
    }
  ];

  return (
    <div className="flex-1 p-10 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">Đăng ký</h2>
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

        <InputFieldGroup fields={nameFields} />
        <InputFieldGroup fields={contactFields} />
        <InputFieldGroup fields={passwordFields} />

        <SubmitButton isLoading={isLoading} loadingText="Đang đăng ký...">
          Đăng ký
        </SubmitButton>
      </form>
      
      <div className="mt-6 text-center text-gray-600">
        Bạn đã có tài khoản? 
        <Link to="/login" className="text-green-700 font-semibold hover:underline ml-1">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
