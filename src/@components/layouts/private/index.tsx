import { Drawer } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderNav from '../header';
import SidebarComponent from '../menu';
import MenuItems from '../menu/menu-items';
import { HeartOutlined } from '@ant-design/icons';

const PrivateLayout = () => {
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="font-sans">
      <div className="flex relative h-screen overflow-hidden">
        <SidebarComponent />
        <div className="h-screen overflow-auto w-full bg-[#f2f5f8]">
          <HeaderNav showDrawer={setOpen} />
          <main className="flex-1 overflow-auto mx-4 lg:mx-[30px] py-3">
            <div className="min-h-[calc(100vh-178px)]">
              <Outlet />
            </div>
            <footer className="bg-white py-4 mt-8">
              <div className="mx-auto px-4 space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                  {/* Copyright Section */}
                  <div className="text-xs sm:text-sm text-center sm:text-left whitespace-nowrap">
                    © Copyright {new Date().getFullYear()}. All Rights Reserved
                    by Lexy
                  </div>

                  {/* Developer Attribution */}
                  <div
                    className="flex items-center text-xs sm:text-sm justify-center whitespace-nowrap"
                    aria-label="Developer attribution"
                  >
                    Developed with
                    <HeartOutlined
                      className="mx-1 sm:mx-2 text-red-500"
                      aria-hidden="true"
                    />
                    by
                    <a
                      href="https://www.m4yours.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
                      aria-label="Visit M4YOURS IT website"
                    >
                      M4YOURS IT
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>

      <Drawer title="Menu" onClose={onClose} open={open}>
        <div className="flex justify-center items-center">
          <MenuItems collapsed={false} />
        </div>
      </Drawer>
    </div>
  );
};

export default PrivateLayout;
