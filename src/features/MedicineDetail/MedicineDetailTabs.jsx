import React from 'react';
import TabNavigation from '../../ui/TabNavigation';

const MedicineDetailTabs = ({ medicine, tab, setTab }) => {
  const tabs = ['Thành phần', 'Công dụng', 'Cách sử dụng', 'Lưu ý sản phẩm', 'Thông tin sản xuất'];

  const renderTabContent = () => {
    switch (tab) {
      case 'Thành phần':
        return (
          <div className="text-gray-700 mb-4 whitespace-pre-line">
            {medicine.ingredient}
          </div>
        );
      case 'Công dụng':
        return (
          <div className="text-gray-700 mb-4 whitespace-pre-line">
            {medicine.benefit}
          </div>
        );
      case 'Cách sử dụng':
        return (
          <div className="text-gray-700 mb-4">
            {medicine.use}
          </div>
        );
      case 'Lưu ý sản phẩm':
        return (
          <div className="text-gray-700 mb-4">
            {medicine.note}
          </div>
        );
      case 'Thông tin sản xuất':
        return (
          <div className="text-gray-700 mb-4">
            {medicine.produce.name}.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
        <TabNavigation 
          tabs={tabs}
          activeTab={tab}
          onTabChange={setTab}
        />
        <div className="mt-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailTabs;
