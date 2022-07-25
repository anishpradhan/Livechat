import React, { useState } from "react";
import { FaUser } from "react-icons/fa";

const SentMessage = ({
  message,
  messageStatus,
  sentMessageContinue,
  lastMessage,
  samePreviousSender,
  timeStamp,
}) => {
  const [toggleTime, setToggleTime] = useState(false);

  var timer;
  return (
    <div
      className={`flex flex-row-reverse items-top space-x-2 space-x-reverse relative  ${
        sentMessageContinue ? "space-y-[1px]" : "space-y-0"
      }`}
    >
      <span
        className={`w-8 h-8 shrink-0 rounded-full border-4 bg-gray-200 flex justify-center items-center ${
          samePreviousSender ? "invisible" : "visible self-center"
        }`}
      >
        <FaUser color="grey" />
      </span>

      <div className="flex flex-col items-end max-w-xl">
        {sentMessageContinue ? null : (
          <span className="text-sm text-gray-500 z-0">You</span>
        )}

        {toggleTime ? (
          <div
            className={`absolute bg-[#616164] self-center right-10 py-1 px-2 rounded-md z-10 shadow-2xl ${
              sentMessageContinue ? "-top-10" : "-top-5"
            }`}
          >
            <span className="text-white text-sm">{timeStamp}</span>
          </div>
        ) : null}
        <span
          className={`py-3 px-4 bg-[#427FE1] break-all text-white rounded-l-3xl rounded-r-lg text-left text-[15px] z-0 ${
            !samePreviousSender ? "rounded-br-3xl" : ""
          } ${!sentMessageContinue ? "rounded-tr-3xl" : ""}`}
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

        {lastMessage ? (
          <span className="text-[13px] text-gray-500 flex space-x-1 items-end">
            {messageStatus ? (
              <>
                <FaUser color="grey" />

                <span>Read</span>
              </>
            ) : 
              
                'Delivered'
              
            }
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default SentMessage;
