import React from "react";
import {Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

const PrivateRoute = ({ isAuthenticated, isLoading }) => {
  if (isLoading) {
    return <Loading />;
  } else if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
