import React from 'react';

const RealTimeOverview = () => {
    return (
        <div className="flex flex-col items-start space-y-2">
              <span className="font-semibold text-base">Real Time Overview</span>
              <div className=" rounded-md w-full flex ring-1 ring-gray-300 text-left flex-wrap ">
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer py-4 flex flex-col justify-between basis-1/4 grow items-stretch px-4 space-y-2">
                      <span className="text-md font-semibold">Customers online</span>
                      <span className="text-3xl font-semibold font-mono ">1</span>
                  </div>
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer py-4 flex flex-col basis-1/4 px-4 items-stretch grow justify-between space-y-2">
                      <span className="text-md font-semibold">Ongoing chats</span>
                      <span className="text-3xl font-semibold font-mono">1</span>
                  </div>
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer py-4 flex flex-col basis-1/4  px-4 items-stretch grow justify-between space-y-2">
                      <span className="text-md font-semibold">Unassigned tickets</span>
                      <span className="text-3xl font-semibold font-mono">1</span>
                  </div>
                  <div className="hover:bg-[#F3F7F9] hover:cursor-pointer py-4 flex flex-col basis-1/4 grow px-4 items-stretch justify-between space-y-2">
                      <span className="text-md font-semibold">No agents yet</span>
                      <button className="text-sm font-semibold font-sans self-start ring-1 ring-blue-500 text-blue-500 px-5 py-2 rounded-md">Create Agents</button>
                  </div>


                  
              </div>
          </div>
    );
};

export default RealTimeOverview;