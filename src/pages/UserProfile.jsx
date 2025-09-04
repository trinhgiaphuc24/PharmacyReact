import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import LoadingSpinner from '../ui/LoadingSpinner';
import InputField from '../ui/InputField';
import SubmitButton from '../ui/SubmitButton';
import Header from '../ui/Header';
import Footer from '../ui/Footer';

const PasswordChangeForm = ({ passwordData, isChangingPassword, passwordErrors, handlePasswordChange, handlePasswordSubmit }) => {
  return (
    <div className="p-8">
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <InputField
          label="Mật khẩu hiện tại"
          name="current_password"
          type="password"
          value={passwordData.current_password}
          onChange={handlePasswordChange}
          error={passwordErrors.current_password}
          placeholder="Nhập mật khẩu hiện tại"
        />

        <InputField
          label="Mật khẩu mới"
          name="new_password"
          type="password"
          value={passwordData.new_password}
          onChange={handlePasswordChange}
          error={passwordErrors.new_password}
          placeholder="Nhập mật khẩu mới"
        />

        <InputField
          label="Xác nhận mật khẩu mới"
          name="confirm_password"
          type="password"
          value={passwordData.confirm_password}
          onChange={handlePasswordChange}
          error={passwordErrors.confirm_password}
          placeholder="Nhập lại mật khẩu mới"
        />

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <SubmitButton
            isLoading={isChangingPassword}
            loadingText="Đang đổi mật khẩu..."
            className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Đổi mật khẩu
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

const UserProfile = () => {
  const {
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
  } = useUserProfile();

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Thông tin cá nhân</h1>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>       
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Họ"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={errors.first_name}
                      placeholder="Nhập họ"
                    />

                    <InputField
                      label="Tên"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={errors.last_name}
                      placeholder="Nhập tên"
                    />
                  </div>

                  <div className="mt-6">
                    <InputField
                      label="Tên đăng nhập"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      error={errors.username}
                      placeholder="Nhập tên đăng nhập"
                      disabled
                    />
                  </div>
                </div>

                <div>                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="Nhập email"
                    />

                    <InputField
                      label="Số điện thoại"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleChange}
                      error={errors.phone_number}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <SubmitButton
                    isLoading={isUpdating}
                    loadingText="Đang cập nhật..."
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Cập nhật thông tin
                  </SubmitButton>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Đổi mật khẩu</h2>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  {showPasswordForm ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            {showPasswordForm && (
              <PasswordChangeForm 
                passwordData={passwordData}
                isChangingPassword={isChangingPassword}
                passwordErrors={passwordErrors}
                handlePasswordChange={handlePasswordChange}
                handlePasswordSubmit={handlePasswordSubmit}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
