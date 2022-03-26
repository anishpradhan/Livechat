import React from "react";
// import { useState } from "react";
// import { useEffect } from "react";
import { NavLink } from "../NavLink";
import { hasRead } from "../../modules/websocket";
import { useDispatch } from "react-redux";


const Contact = ({ name, chatURL, last_message, totalUnreadMessages, setToggle }) => {

  // const [newTimeStamp, setNewTimeStamp] = useState(null);
  // useEffect(() => {renderTimestamp}, [newTimeStamp]);
  const dispatch = useDispatch();
  const renderTimestamp = (timestamp) => {
    let prefix = "";
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
      // less than one minute ago
      prefix = "just now...";
    } else if (timeDiff < 60 && timeDiff >= 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff}m`;
    } else if (timeDiff < 24 * 60 && timeDiff >= 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)}h`;
    } else if (timeDiff < 7 * 24 * 60 && timeDiff >= 24 * 60) {
      // less than 7 days ago
      prefix = `${weekday[new Date(timestamp).getDay()]}`;
    } else if (timeDiff >= 7 * 24 * 60 ){
      // less than 7 days ago
      prefix = `${month[new Date(timestamp).getMonth()] + ' ' + new Date(timestamp).getDate()}`;

    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  const handleClick = () => {
    setToggle();
    if (totalUnreadMessages !== '0'){
    dispatch(hasRead(chatURL, 'agent'));}
  };
  // console.log(renderTimestamp(last_message.sent_time));
  // setNewTimeStamp(setInterval(() => {
  //   renderTimestamp(last_message.sent_time);
  // }, 4000));
  // setNewTimeStamp(renderTimestamp(last_message.sent_time));
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
          <div className={`rounded-full w-10 h-10 bg-[#58658E] ${totalUnreadMessages!=="0" ? 'border-2 ring-2 ring-red-600 ' : 'border-none py-1' }`}>
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
          <span className="text-[12px] font-medium">{renderTimestamp(last_message.sent_time)}</span>
          <div className={`w-4 h-4 bg-red-600 rounded-full flex items-center justify-center ${totalUnreadMessages === '0' ? 'invisible': ''}`}><span className="text-white font-bold text-[10px]">{totalUnreadMessages}</span></div>
        </div>
      </li>
    </NavLink>
  );
};

export default Contact;
