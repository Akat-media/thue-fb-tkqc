import React from "react";
// import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import {useUserStore} from "../stores/useUserStore.ts";

const ProtectedRoute: React.FC = () => {
    // const { isAuthenticated, isLoading } = useAuth();
    const user = useUserStore((state) => state.user);

    // if (isLoading) {
    //     return <div>Đang tải...</div>; // Hoặc một component loading
    // }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
