import React from 'react';

const SidebarWidget = () => {
  return (
    <div className="mx-4 mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pro Feature</h3>
      <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Upgrade to unlock more features.</p>
    </div>
  );
};

export default SidebarWidget;