import React from "react";
import { NavLink } from "../NavLink";
import TimeStampContact from "./TimeStampContact";

const Contact = ({
  name,
  chatURL,
  last_message,
  totalUnreadMessages,
  setToggle,
}) => {
  
  const handleClick = () => {
    setToggle();
  };
  return (
    <NavLink
      to={`/dashboard/chat/${chatURL}`}
      activeClassName="chatList-active"
    >
      <li
        className="border-none border-r-0 h-20 flex px-3 hover:bg-[#E1E9EC] hover:cursor-pointer max-h-full overflow-hidden"
        onClick={handleClick}
      >
        <div className="basis-2/12 flex items-center justify-center ">
          <div
            className={`rounded-full w-10 h-10 bg-[#58658E] ${
              totalUnreadMessages !== "0"
                ? "border-2 ring-2 ring-red-600 "
                : "border-none py-1"
            }`}
          >
            <span className="text-xl text-white">{name[0]}</span>
          </div>
        </div>
        <div className="basis-8/12">
          <div className="h-full flex flex-col items-stretch overflow-hidden ">
            <div className="h-1/2 flex items-end">
              <span className="text-[14px] font-semibold font-sans relative left-4">
                {name}
              </span>
            </div>
            <div className="h-1/2 flex items-start ">
              <p className="text-[14px] relative left-4 truncate w-36 text-left">
                {last_message.message}
              </p>
            </div>
          </div>
        </div>
        <div className="basis-2/12 flex flex-col items-center justify-center space-y-1">
          <TimeStampContact time={last_message.sent_time}/>
          <div
            className={`w-4 h-4 bg-red-600 rounded-full flex items-center justify-center ${
              totalUnreadMessages === "0" ? "invisible" : ""
            }`}
          >
            <span className="text-white font-bold text-[10px]">
              {totalUnreadMessages}
            </span>
          </div>
        </div>
      </li>
    </NavLink>
  );
};

export default Contact;
