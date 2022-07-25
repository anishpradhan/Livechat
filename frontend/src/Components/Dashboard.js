import React, {  useLayoutEffect } from "react";
import { useDispatch} from "react-redux";
import {
  wsConnect,
  wsDisconnect,
} from "../modules/websocket";

import { Outlet } from "react-router-dom";
import DashboardPanel from "./DashboardPanel";

const Dashboard = () => {
  const dispatch = useDispatch();
  const connectEventSocket = () => {
    const host = `${process.env.REACT_APP_SOCKET_EVENT_URL}?token=${localStorage.getItem("access")}`;
    dispatch(wsConnect(host));
  };

  const disconnect = () => {
    const host = `${process.env.REACT_APP_SOCKET_EVENT_URL}`;
    dispatch(wsDisconnect(host));
  };

  useLayoutEffect(() => {
    connectEventSocket();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row ">
      <div className="hidden sm:block">
        <DashboardPanel />
      </div>
      
        <div className="w-full h-screen sm:ml-16 ">
          <Outlet />
        </div>
      
      <div className="block sm:hidden">
        <DashboardPanel />
      </div>
    </div>
  )}

export default Dashboard;
