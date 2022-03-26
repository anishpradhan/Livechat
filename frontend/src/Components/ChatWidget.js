import React from "react";
import { Transition } from "@tailwindui/react";

const ChatWidget = ({ expanded, setExpanded }) => {
  const expandedFunc = () => {
    setExpanded(!expanded);
  };
  return (
    <Transition
      show={expanded}
      enter="transition ease-out duration-300 "
      enterFrom="transform translate-y-0 scale-50"
      enterTo="transform translate-y-0 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform translate-y-36 scale-100"
      leaveTo="transform -translate-y-4 scale-50"
      className="fixed right-6 bottom-4 origin-bottom-right"
    >
      <div
        id="window"
        className="w-96 max-h-[600px] relative bottom-4 right-6 flex flex-col bg-white rounded-2xl shadow-lg"
      >
        <div className="bg-orange-400 basis-12 rounded-t-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center relative left-8 text-neutral-100 font-sans font-bold">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="px-2">Anish Pradhan</span>
          </div>
          <div className="relative right-3">
            <span
              className="text-neutral-100 text-xl font-sans font-bold hover:cursor-pointer"
              onClick={expandedFunc}
            >
              X
            </span>
          </div>
        </div>

        <div className="basis-9/12 flex flex-col overflow-y-auto my-3 px-3 space-y-3">
          <div className="flex items-top space-x-2 space-y-6 ">
            <span className="w-12 h-12 shrink-0 rounded-full border-4 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 -3 18 26"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <span className="p-3 flex-shrink bg-orange-100 rounded-b-3xl rounded-tr-3xl">
              Hello
            </span>
          </div>

          <div className="flex flex-row-reverse items-top space-x-2 space-x-reverse space-y-6">
            <span className="w-12 h-12 shrink-0 border-4 bg-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 -3 18 26"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <div className="relative  p-3  bg-green-100 rounded-b-3xl rounded-tl-3xl">
              Hey! How are you?
            </div>
          </div>

          <div className="flex items-top space-x-2 space-y-6">
            <span className="w-12 h-12 shrink-0 border-4 bg-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 -3 18 26"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <span className="p-3 flex-shrink bg-orange-100 rounded-b-3xl rounded-tr-3xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis dolor cupiditate quo facere quidem impedit repellendus
              cumque at, ad minima reiciendis dolorum debitis quae soluta,
              eveniet nemo reprehenderit delectus id.
            </span>
          </div>

          <div className="flex flex-row-reverse items-top space-x-2 space-x-reverse space-y-6">
            <span className="w-12 h-12 shrink-0 border-4 bg-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 -3 18 26"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <div className="relative  p-3  bg-green-100 rounded-b-3xl rounded-tl-3xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum quasi
              iusto atque vel nam repellendus exercitationem eveniet sequi
              deleniti dolor tempore veritatis, libero quas dolores beatae nulla
              id pariatur porro.
            </div>
          </div>

          <div className="flex flex-row-reverse items-top space-x-2 space-x-reverse space-y-6">
            <span className="w-12 h-12 shrink-0 border-4 bg-white rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-300"
                fill="none"
                viewBox="0 -3 18 26"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <div className="relative  p-3  bg-green-100 rounded-b-3xl rounded-tl-3xl">
              Hey! How are you?
            </div>
          </div>
        </div>

        <div className="bg-orange-100 basis-2/12 flex items-center justify-between rounded-b-lg">
          <input
            type="text"
            placeholder="Type your message here"
            className="relative left-3 w-72 h-12 rounded-lg border-2 border-orange-300 px-2 "
          />

          <button className="relative right-2 border-2 p-2 rounded-lg bg-white hover:shadow-lg">
            Send
          </button>
        </div>
      </div>
    </Transition>
  );
};

export default ChatWidget;
