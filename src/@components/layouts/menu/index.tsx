import logo from '@/assets/misc/logo.png';
import {
  RiArrowLeftDoubleFill,
  RiArrowRightDoubleFill,
} from '@remixicon/react';
import React, { useState } from 'react';
import MenuItems from './menu-items';

const SidebarComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`h-screen relative transition-all duration-300 ${!collapsed ? 'min-w-[256px]' : 'min-w-[20px]'} border-r border-gray-200 hidden lg:block`}
    >
      <button
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
        className="absolute z-[100] right-[-12px] top-[50px] bg-gray-300 rounded-full"
      >
        {collapsed ? (
          <RiArrowRightDoubleFill size={25} />
        ) : (
          <RiArrowLeftDoubleFill size={25} />
        )}
      </button>
      <div className="flex justify-center items-center p-4">
        <img
          src={logo}
          alt="lexy Logo"
          className="logo object-contain h-12"
          style={{ maxWidth: '50%' }}
        />
      </div>
      <div
        className="flex justify-center"
        style={{
          height: `calc(100% - 78px)`,
          overflow: 'auto',
        }}
      >
        <MenuItems collapsed={collapsed} />
      </div>
    </div>
  );
};

export default SidebarComponent;
