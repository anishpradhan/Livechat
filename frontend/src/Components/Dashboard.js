import React from "react";

import {
  Outlet,
} from "react-router-dom";
import DashboardPanel from "./DashboardPanel";

const Dashboard = () => {
  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="hidden sm:block">
        <DashboardPanel />
      </div>

      <div className="w-full h-full overflow-y-hidden">
        <Outlet />
      </div>
      <div className="block sm:hidden">
        <DashboardPanel />
      </div>
    </div>
  );
};

export default Dashboard;
