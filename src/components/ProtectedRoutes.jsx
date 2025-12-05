import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { token } = useSelector((state) => state.user);

  if (!token) {
    return <Navigate to={redirectPath} replace />; // redirect if not authenticated
  }

  return <Outlet />; // render nested routes if authenticated
};

export default ProtectedRoute;
