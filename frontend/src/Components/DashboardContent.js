import React from "react";
import RealTimeOverview from "./Dashboard/RealTimeOverview";
import { useSelector } from "react-redux";
import ChatChart from "./Dashboard/ChatChart";

const DashboardContent = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="flex flex-col justify-around items-center ">
      <div className="h-full flex justify-center py-20 px-4 min-w-[55%]">
        <div className="h-full w-full flex flex-col space-y-8 shrink-0">
          <div className="h-24 py-6 px-4 flex justify-between">
            <div className="flex items-top space-x-2 font-sans">
              <div className="border-2 rounded-full w-14 h-14 flex items-center bg-[#F3F7F9]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-14 relative left-1 fill-[#B5BBC1]"
                  fill=""
                  viewBox="0 0 28 28"
                  stroke="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-base sm:text-2xl  font-semibold">
                  {/* Good Morning, {first_name} {last_name}! */}
                  {/* Good Morning, {user['first_name']+' '+user['last_name']} ! */}
                  Good Morning, {user.first_name + " " + user.last_name} !
                </span>
                <span className="text-sm sm:block hidden">
                  Check your stats and suggestions for using LiveChat
                </span>
              </div>
            </div>
            <div >
              <button className="py-2 px-4 border-2 rounded-md font-semibold text-sm hover:bg-slate-100 duration-500 ">
                Explore LiveChat
              </button>
            </div>
          </div>
          <RealTimeOverview />
          <ChatChart />
          <ChatChart />
        </div>
      </div>
    </div>
  );
};


export default DashboardContent;
