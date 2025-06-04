import React, { useState } from "react";
import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
import Footer from "./Footer";
import NotificationOverlay from '../../pages/notify/NotificationOverlay';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => {
      return !prev;
  });

  const user = localStorage.getItem("user");
  const role = typeof user === "string" ? JSON.parse(user)?.user.role : "";

  return role === "admin" ? (
    <div className="flex bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-14"
        } flex-1 min-h-screen p-4 overflow-y-auto`}
      >
        {children}
      </main>
      <NotificationOverlay />
    </div>
  ) : (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/*<Navbar />*/}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
