import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.ts";

const ProtectedRoute: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    // Thử fetch user khi component mount
    fetchUser();
  }, [fetchUser]);

  // Kiểm tra cả localStorage để đảm bảo
  const hasToken = localStorage.getItem("access_token");

  if (!user && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
