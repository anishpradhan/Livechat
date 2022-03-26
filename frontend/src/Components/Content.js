import React from "react";
// import { useState } from "react";
import { Transition } from "@tailwindui/react";

const Content = ({ expanded, setExpanded }) => {
  //   const [clicked, setClicked] = useState(false);

  return (
    <div className="absolute">
    
      <Transition
        show={!expanded}
        enter="transition ease-out duration-200"
        enterFrom="transform translate-y-12"
        enterTo="transform translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="transform translate-y-0"
        leaveTo="transform translate-y-36"
        className="fixed right-4 bottom-2 origin-bottom"
      >
        <div
          className="relative right-6 bottom-4 p-3 text-center bg-orange-500 shadow-lg rounded-full hover:cursor-pointer hover:bg-orange-600"
          onClick={() => {
            //   setClicked(!clicked);
            setExpanded(!expanded);
            //   if(!expanded){
            //       setClicked(expanded);
            //   }
            //   console.log(clicked);
          }}
        >
          {/* {clicked ? "X" : "Chat"} */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        </Transition>
    </div>
  );
};

export default Content;
