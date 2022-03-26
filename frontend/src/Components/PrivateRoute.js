import React from "react";
import {Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, isLoading }) => {
  if (isLoading) {
    return <h1>Loading...</h1>;
  } else if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
