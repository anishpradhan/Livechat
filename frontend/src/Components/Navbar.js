import React from "react";
import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [toogle, setToogle] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const guestLinks = () => (
    <Fragment>
      <li className="hover:text-sky-500 hover:cursor-pointer">
        <Link className="" to="/login">
          Login
        </Link>
      </li>
      <li className="hover:text-sky-500 hover:cursor-pointer">
        <Link className="" to="/signup">
          Signup
        </Link>
      </li>
    </Fragment>  
   );
  

  const authLinks = () => (
    <Fragment>
      <li className="hover:text-sky-500 hover:cursor-pointer">
        <Link className="" to="/dashboard">
          Go to app
        </Link>
      </li>
    </Fragment> );

  return (
    <Fragment>
      <nav className="">
        <div className="flex justify-around items-center border-b font-sans h-16 ">



          <span className="text-lg font-bold">Live Chat</span>



          <div className="hidden xl:flex justify-between gap-2 items-center rounded-full leading-5 py-1 bg-sky-400/10 hover:bg-sky-400/20 hover:cursor-pointer">
            <div className="flex-auto text-xs font-bold text-sky-600">
              Tailwind CSS v3.0
            </div>
            <div className="text-xs font-medium text-sky-600">
              Just-in-Time all the time, colored shadows, scroll snap and more{" "}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-sky-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="items-center hidden md:flex text-gray-700 text-sm font-semibold space-x-8 ">
          <ul className="flex space-x-4">  
            {isAuthenticated ? authLinks() : guestLinks()}
          </ul>
          </div>

          {!toogle ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:hidden hover:cursor-pointer "
              onClick={() => {
                setToogle(!toogle);
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:hidden hover:cursor-pointer"
              onClick={() => {
                setToogle(!toogle);
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <div
          className={
            "items-stretch flex-col text-gray-700 text-sm font-semibold shadow-lg " +
            (toogle ? "flex md:hidden" : "hidden")
          }
        >
          <ul className="flex flex-col space-y-4 py-4">  
            {isAuthenticated ? authLinks() : guestLinks()}
          </ul>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navbar;
