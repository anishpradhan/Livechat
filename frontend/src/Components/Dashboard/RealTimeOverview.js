import React from 'react';

const RealTimeOverview = () => {
    return (
        <div className="flex flex-col items-start space-y-2">
              <span className="font-semibold text-lg">Real Time Overview</span>
              <div className=" rounded-md w-full h-32 flex shadow-md">
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer flex flex-col basis-1/4 items-start px-4 justify-center space-y-2">
                      <span className="text-md font-semibold">Customers online</span>
                      <span className="text-3xl font-semibold font-mono">1</span>
                  </div>
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer flex flex-col basis-1/4 px-4 items-start justify-center space-y-2">
                      <span className="text-md font-semibold">Ongoing chats</span>
                      <span className="text-3xl font-semibold font-mono">1</span>
                  </div>
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer flex flex-col basis-1/4  px-4 items-start justify-center space-y-2">
                      <span className="text-md font-semibold">Unassigned tickets</span>
                      <span className="text-3xl font-semibold font-mono">1</span>
                  </div>
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer flex flex-col basis-1/4  px-4 items-start justify-center space-y-4">
                      <span className="text-md font-semibold">No agents yet</span>
                      <button className="text-sm font-semibold font-sans border-2 shadow-md p-2">Create Agents</button>
                  </div>
                  
              </div>
          </div>
    );
};

export default RealTimeOverview;