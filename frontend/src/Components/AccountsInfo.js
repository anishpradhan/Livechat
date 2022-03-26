import React from "react";


const AccountsInfo = () => {
  return (
    <div className="bg-gray-100 hidden sm:block md:w-[480px] sm:w-[380px] px-8 shrink-0">
      <div className="mt-12">
        <div className="flex flex-col p-4 items-start space-y-6">
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
      </div>
    </div>
  );
};

export default AccountsInfo;
