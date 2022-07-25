import React from "react";


const AccountsInfo = () => {
  return (
    <div className="bg-gray-100 hidden sm:block md:w-[480px] sm:w-[380px] shrink-0 overflow-hidden">
      <div className="mt-12 flex flex-col space-y-8">
        <div className="flex flex-col py-8 px-16 items-start space-y-6 z-50">
          <span
            className="font-sans text-3xl font-bold tracking-tighter"
          >
            Live Chat | <span className="text-lg font-bold">Accounts</span>
          </span>

          <span className="font-medium text-2xl tracking-tighter text-left">Sign in to all your tools with just one account.</span>

          <span className=""><a href="#" className="text-blue-700">Learn more</a> about Livechat Accounts</span>

          <span className="font-bold">________</span>
            <div className="text-left">
          <p className="font-semibold text-sm">What is Livechat?</p>
          <p className="text-sm">LiveChat is a complete customer service platform that delights your customers and fuels your sales.</p>
          </div>
        </div>
        <div className="relative h-[450px] bg-gradient-to-b from-gray-100 via-red-600 to-[#B91C1C] z-10">
          {/* <div className="absolute border-2 top-[-50%] w-96 h-96 rounded-full bg-[#F3F4F6]"></div>   */}
          <div className="absolute  border-b-2 bottom-[-360px] right-[4px] w-[700px] h-[700px] rounded-full bg-[#F3F4F6]"></div>  
          <div className="absolute  border-b-2 bottom-[-100px] right-[180px] w-[350px] h-[350px] rounded-full  bg-gradient-to-b from-gray-100 to-[#B91C1C] z-20"></div>  
        </div>
        
      </div>
    </div>
  );
};

export default AccountsInfo;
