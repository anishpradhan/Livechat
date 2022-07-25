import React from "react";
import { chat } from "../../Assets";
import {IoIosPeople, IoMdTime} from "react-icons/io";
import {HiShoppingCart, HiCheckCircle} from "react-icons/hi";
import {AiFillLike} from "react-icons/ai";

const ChatChart = () => {
  return (
    <div className="flex flex-col items-stretch space-y-2 text-left">
      <p className="font-semibold text-base">Last 7 days</p>
      <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4 ">
        <div className="basis-1/2 flex flex-col space-y-2 p-5 ring-1 ring-gray-400 rounded-md">
          <div className="flex justify-between text-[14px] ">
            <strong className="">Total Chats</strong>
            <div className="flex divide-x-2  ring-1 ring-gray-400 rounded-md ">
              <button className="selected px-2 py-1 rounded-l-md font-semibold bg-gray-300">
                My stats
              </button>
              <button className="px-2 py-1 ">All agents</button>
            </div>
          </div>
          <div className="flex flex-col space-y-2 ">
            <div className="flex justify-center py-5">
              <img src={chat} alt="..." />
            </div>
            <strong className="text-normal text-center">No chats yet</strong>
            <div className="flex justify-center"><p className="text-sm">Its okay to start chatting by yourself</p></div>
          </div>

          <span className="py-4"><hr /></span>
          <div className="flex flex-col space-y-7 font-bold text-[14px]">
            <div className="flex items-center">
                <div className="flex items-center"><IoIosPeople size={23}/></div>
                <p className="grow px-2">Queued visitors</p>
                <p className="text-xl">0</p>
            </div>
            <div className="flex items-center">
            <div className="flex items-center"><HiShoppingCart size={20}/></div>
                <p className="grow px-2">Goals</p>
                <div className=""><button className="ring-1 ring-blue-500 px-3 py-1 rounded-sm">+ Add</button></div>
            </div>
            <div className="flex items-center">
            <div className="flex items-center"><HiShoppingCart size={20}/></div>
                <p className="grow px-2">Sales</p>
                <div className=""><button className="ring-1 ring-blue-500 px-3 py-1 rounded-sm">+ Add</button></div>
            </div>
            <div className="flex items-center">
            <div className="flex items-center"><AiFillLike size={20}/></div>
                <p className="grow px-2">Chat Satisfaction</p>
                <p className="text-xl">-</p>
            </div>
          </div>
        </div>
        <div className="basis-1/2 flex flex-col space-y-2 p-5 ring-1 ring-gray-400 rounded-md">
          <div className="flex justify-between text-[14px] ">
            <strong >New tickets</strong>
            
          </div>
          <div className="flex flex-col space-y-2 ">
            <div className="flex justify-center py-5">
              <img src={chat} alt="..." />
            </div>
            <strong className="text-normal text-center">No tickets yet</strong>
            <div className="flex justify-center"><p className="text-sm">Its okay to start ticekting by yourself</p></div>
          </div>

          <span className="py-4"><hr /></span>
          <div className="flex flex-col space-y-7 font-bold text-[14px]">
            <div className="flex items-center">
                <div className="flex items-center"><HiCheckCircle size={23}/></div>
                <p className="grow px-2">Solved tickets</p>
                <p className="text-xl">0</p>
            </div>
            <div className="flex items-center">
            <div className="flex items-center"><IoMdTime size={20}/></div>
                <p className="grow px-2">First response time</p>
                <p className="text-xl">-</p>
            </div>
            <div className="flex items-center">
            <div className="flex items-center"><IoMdTime size={20}/></div>
                <p className="grow px-2">Resolution time</p>
                <p className="text-xl">-</p>
            </div>
            <div className="flex items-center">
            <div className="flex items-center"><AiFillLike size={20}/></div>
                <p className="grow px-2">Ticket Satisfaction</p>
                <p className="text-xl">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatChart;
