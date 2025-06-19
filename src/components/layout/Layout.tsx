import React, { useState } from "react";
import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
import Footer from "./Footer";
import NotificationOverlay from "../../pages/notify/NotificationOverlay";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () =>
    setIsSidebarOpen((prev) => {
      return !prev;
    });

  const user = localStorage.getItem("user");
  const role = typeof user === "string" ? JSON.parse(user)?.user.role : "";

  return role === "admin" ? (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-14"
        } flex-1 min-h-screen pl-0 pr-4 py-0 overflow-y-auto w-full bg-white shadow-inner`}
      >
        {children}
      </main>
      <NotificationOverlay />
    </div>
  ) : (
    <div className="flex flex-col min-h-screen w-full">
      {/*<Navbar />*/}
      <main className="flex-grow pl-0 w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
