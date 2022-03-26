import React, { useEffect } from "react";
import { checkAuthenticated, load_user } from "../store/actions/auth";
import {useDispatch } from "react-redux";

const Layout = ({ children }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthenticated());
    dispatch(load_user());
  },[]);
  return <div>
    {children}
    </div>;
};

export default Layout;
