import React, { useState } from "react";

const ChatDetail = ({ username }) => {
  const [openTab, setOpenTab] = useState(1);

  return (
    <div className="h-full flex flex-col flex-nowrap items-stretch bg-[#F3F7F9] border-r-2">
      <ul
        className="border-b-2 h-14 flex items-end pt-2 px-4 space-x-2 "
        role="tablist"
      >
        <li>
          <a
          className={`block hover:cursor-pointer pb-1 ${openTab === 1 ? "border-b-4 border-blue-800" : "pb-2"}`}
          href="#link1"
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(1);
            }}
            role="tablist"
            data-toggle="tab"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="black"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </a>
        </li>
        <li className=" ">
        <a
         className={`block hover:cursor-pointer pb-1 ${openTab === 2 ? "border-b-4 border-blue-800" : "pb-2"}`}
            href="#link2"
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(2);
            }}
            role="tablist"
            data-toggle="tab"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          </a>
        </li>
      </ul>
      <div
        className={`flex flex-col px-6 space-y-3 overflow-y-auto ${openTab === 1 ? "block" : "hidden"}`} id="link1"

      >
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-lg">Details</span>
          <span className="h-full pt-1 hover:cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </span>
        </div>
        <div className="h-full bg-white border-[1px] rounded-lg flex flex-col items-stretch">
          <div className="px-5 py-4 text-left">
            <span className="font-semibold">General Info</span>
          </div>
          <div className="px-4 pb-1 flex space-x-2">
            <div className="border-none rounded-full w-10 h-10 py-1 bg-[#58658E]">
              <span className="text-xl text-white">{username ? username[0] : null}</span>
            </div>
            <span className="">{username}</span>
          </div>
          <div className="py-2 px-4 flex space-x-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span className="font-medium text-sm ">11:10 pm local time</span>
          </div>
          <div className="px-4 text-left flex space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-sm pb-3">
              Kathmandu, Bagmati Province, Nepal
            </span>
          </div>

          {/* <div className="w-full h-36 bg-amber-300 mt-4 box-border pt-14">
            <span className="text-3xl">Map</span>
          </div> */}
        </div>
        <div className="min-h-34 px-5 py-4 bg-white border-[1px] flex flex-col items-stretch space-y-3">
          <div className="text-left">
            <span className="font-semibold">Visited pages</span>
          </div>
          <div className="flex space-x-1 items-start">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="gray"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex flex-wrap font-medium text-sm space-x-2">
              <span>Garjoo E-commerce</span>{" "}
              <a href="#" className="text-blue-600 underline">
                www.garjoo.comdasfasdfa
              </a>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-white border-[1px] flex flex-col items-start space-y-2">
          <div className="text-left mb-2">
            <span className="font-semibold">Additional Info</span>
          </div>
          <span className="text-sm text-left">
            Returning visitor:{" "}
            <span className="font-semibold">2 visits, 2 chats</span>
          </span>
          <span className="text-sm">
            Last seen: <span className="font-semibold">today</span>
          </span>
          <span className="text-sm">
            Group: <span className="font-semibold">General</span>
          </span>
        </div>

        <div className="px-5 py-4 bg-white border-[1px] flex flex-col items-start space-y-2">
          <div className="text-left mb-2">
            <span className="font-semibold">Technology</span>
          </div>
          <span className="text-sm">
            IP address: <span className="font-semibold">27.34.17.219</span>
          </span>
          <span className="text-sm">
            OS/Device: <span className="font-semibold">Windows (10)</span>
          </span>
          <span className="text-sm">
            Browser: <span className="font-semibold">Firefox (96.0)</span>
          </span>
          <span className="text-sm text-left">
            User agent:{" "}
            <span className="font-semibold">
              Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101
              Firefox/96.0
            </span>
          </span>
        </div>
      </div>
      <div className={`flex flex-col px-6 space-y-3 overflow-y-auto ${openTab === 2 ? "block" : "hidden"}`} id="link2">Add</div>
    </div>
  );
};

export default ChatDetail;
