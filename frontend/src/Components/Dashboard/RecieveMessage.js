import React, { useState } from "react";

const RecieveMessage = ({
  username,
  message,
  receiveMessageContinue,
  lastMessage,
  samePreviousReceiver,
  timeStamp
}) => {
  const [toggleTime, setToggleTime] = useState(false);
  var timer;
  return (
    <div
      className={`flex items-top space-x-2 relative ${
        receiveMessageContinue ? "space-y-[1px]" : "space-y-4"
      }`}
    >
      <span
        className={`w-8 h-8 shrink-0 rounded-full border-4 bg-gray-200 mb-2 ${
          samePreviousReceiver ? "invisible" : "visible self-end"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-300"
          fill="grey"
          viewBox="0 0 22 22"
          stroke="grey"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </span>
      {toggleTime ? (
        
        <div className={`absolute bg-[#616164] self-center left-10 py-1 px-2 rounded-md z-10 shadow-2xl ${receiveMessageContinue ? '-top-10': '-top-5'}`}>
          <span className="text-white text-sm">{timeStamp}</span>
        </div>
    ) : null}
      <div className="flex flex-col items-start max-w-sm md:max-w-prose break-all">
        {receiveMessageContinue ? null : (
          <span className="text-sm text-gray-500">{username}</span>
        )}
        <span
          className={`py-3 px-4 bg-[#F2F3F4] rounded-l-md rounded-r-3xl text-left text-[15px] ${
            !samePreviousReceiver ? "rounded-bl-3xl" : ""
          } ${!receiveMessageContinue ? "rounded-tl-3xl" : ""}`}
          onMouseEnter={() => {
            timer = setTimeout(() => {
              setToggleTime(true);
            }, 500);
          }}
          onMouseLeave={() => {
            clearTimeout(timer);
            setToggleTime(false);
          }}
        >
          {message}
        </span>
      </div>
    </div>
  );
};

export default RecieveMessage;
