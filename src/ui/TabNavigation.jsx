import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={`flex gap-8 border-b mb-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pb-2 font-semibold text-base transition ${
            activeTab === tab 
              ? 'text-green-700 border-b-2 border-green-700' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
