import React from "react";
import { useState } from "react";
import { Transition } from "@tailwindui/react";

const ChatCategory = ({categoryName ,chatList, totalChats}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toogleisOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex items-start py-3 px-2 hover:cursor-pointer" onClick={toogleisOpen}>
        <span className="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={
              "h-6 w-6 hover:cursor-pointer transition duration-300 " +
              (!isOpen ? "" : "rotate-90")
            }
            
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>

          <span className="font-semibold text-lg">{categoryName} ({totalChats})</span>
        </span>
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-300"
        enterFrom="transform -translate-y-1"
        enterTo="transform translate-0"
        leave="transform ease-in duration-75"
        leaveFrom="transform translate-0"
        leaveTo="transform -translate-y-1"
      >
        <ul className="flex flex-col transition duration-500 ">
          {chatList}
        </ul>
      </Transition>
    </div>
  );
};

export default ChatCategory;
