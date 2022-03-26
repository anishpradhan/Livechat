import React from "react";
import { NavLink } from './NavLink';
// import { NavLink } from "react-router-dom";
import { logout } from "../store/actions/auth";
import { connect } from "react-redux";

const DashboardPanel = ({ logout }) => {

  return (
    <div className="w-screen h-16 sm:w-16 sm:h-screen bg-[#131317] flex flex-row sm:flex-col justify-between shrink-0">
      <ul className="flex flex-row sm:flex-col justify-evenly w-full text-white text-xs font-sans font-semibold items-stretch">
        <NavLink end to="/dashboard" activeClassName="bg-[#2B2B2E]">
          <li className="group hover:bg-[#2B2B2E] hover:text-white hover:cursor-pointer py-6 leading-4 hidden sm:flex flex-col items-center space-y-2">
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-hover:fill-white"
              viewBox="0 0 20 20"
              fill="gray"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-gray-400 group-hover:text-white">Home</span>
          </li>
        </NavLink>


        <NavLink to={`/dashboard/chat`} activeClassName="bg-[#2B2B2E]">
        <li className="group hover:bg-[#2B2B2E] hover:cursor-pointer hover:text-white py-2 px-4 sm:py-6 sm:px-0 leading-4 flex flex-col items-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:fill-white"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          <span className="text-gray-400 group-hover:text-white">Chats</span>
        </li>
        </NavLink>

        <li className="group hover:bg-[#2B2B2E] hover:cursor-pointer py-2 px-4 sm:py-6 sm:px-0 leading-4 flex flex-col items-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:fill-white"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-400 group-hover:text-white">Traffic</span>
        </li>
        <li className="group hover:bg-[#2B2B2E] hover:cursor-pointer py-2 px-4 sm:py-6 sm:px-0 leading-4 flex flex-col items-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:fill-white"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span className='text-gray-400 group-hover:text-white'>Agents</span>
        </li>

        <li className="group hover:bg-[#2B2B2E] hover:cursor-pointer py-2 px-4 sm:py-6 sm:px-0 leading-4 flex flex-col sm:hidden items-center space-y-2" onClick={logout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:fill-white"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span className='text-gray-400 group-hover:text-white'>Logout</span>

        </li>
      </ul>

      <ul className="hidden sm:flex flex-col text-white text-xs font-sans font-semibold items-stretch ">
        <li className="group hover:bg-[#2B2B2E] hover:cursor-pointer py-6 leading-4 flex flex-col items-center space-y-2" onClick={logout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:fill-white"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span className='text-gray-400 group-hover:text-white'>Logout</span>

        </li>
      </ul>
    </div>
  );
};


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(DashboardPanel);  
