import React, { useState } from "react";

const RecieveMessage = ({
  username,
  message,
  receiveMessageContinue,
  lastMessage,
  samePreviousReceiver,
  timeStamp,
}) => {
  const [toggleTime, setToggleTime] = useState(false);
  var timer;
  return (
    <div
      className={`flex items-top space-x-2 relative ${
        receiveMessageContinue ? "space-y-[1px]" : "space-y-4"
      }`}
    >
        <div className={`rounded-full w-8 h-8 mb-2  bg-[#58658E] flex items-center justify-center ${
          samePreviousReceiver ? "invisible" : "visible self-end"
        }`}>
          <span className="text-white leading-none">N</span>
        </div>
      {toggleTime ? (
        <div
          className={`absolute bg-[#616164] self-center left-10 py-1 px-2 rounded-md z-10 shadow-2xl ${
            receiveMessageContinue ? "-top-10" : "-top-5"
          }`}
        >
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
