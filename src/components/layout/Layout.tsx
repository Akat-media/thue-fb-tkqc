import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import NotificationOverlay from '../../pages/notify/NotificationOverlay';
import { Outlet } from 'react-router-dom';
import { usePageStore } from '../../stores/usePageStore';

const Layout = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string | undefined;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () =>
    setIsSidebarOpen((prev) => {
      return !prev;
    });

  //render without navbar and footer
  const is404 = usePageStore((state) => state.is404);
  if (is404) {
     return (
         <div>
             {children}
             <NotificationOverlay />
             <Outlet />
         </div>
     );
  }

  return role === 'admin' ? (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-14'
        } flex-1 min-h-screen pl-0 pr-4 py-0 overflow-y-auto w-full bg-white shadow-inner`}
      >
        {children}
      </main>
      <NotificationOverlay />
      <Outlet />
    </div>
  ) : (
    <div className="flex flex-col min-h-screen w-full">
      {/*<Navbar />*/}
      <main className="flex-grow pl-0 w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {children}
      </main>
      <NotificationOverlay />
      <Footer />
      <Outlet />
    </div>
  );
};

export default Layout;
