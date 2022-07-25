import React from "react";
import { FaRegUser } from "react-icons/fa";

const NewRoomFormDetail = ({ name, detail }) => {
  return (

      <div className="flex items-top space-x-2 relative space-y-4 ">
        <div
          className={`rounded-full w-8 h-8 mb-2  bg-[#58658E] flex items-center justify-center visible self-end}`}
        >
          <span className="text-white leading-none">N</span>
        </div>

        <div className="flex flex-col justify-center w-60 overflow-hidden ring-1 ring-[#e0e2e4] rounded-3xl space-y-2 ">
          {/* <div className="absolute rounded-full w-12 h-12  bg-[#427FE1]  left-1/3 top-[-24px]  flex justify-center items-center">
        {" "}
        <FaRegUser size={22} color={"white"} />{" "}
      </div> */}
          <div className="py-4 bg-[#F3F7F9] text-base">Pre-chat form</div>
          <div className="p-5 flex-col space-y-3 text-left text-sm">
            <div>
              <h2 className="text-gray-500 leading-[22px] ">Name:</h2>
              <span className="block leading-[22px] font-semibold">{name}</span>
            </div>
            <div>
              <h2 className=" text-gray-500 leading-[22px]">Detail:</h2>
              <span className="block leading-[22px] font-semibold">{detail}</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default NewRoomFormDetail;
