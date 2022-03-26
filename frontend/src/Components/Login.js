import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/actions/auth";
import AccountsInfo from "./AccountsInfo";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  var error = useSelector((state) => state.auth.error);
  const [logging, setLogging] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setLogging(true);
    setTimeout(() => {
      dispatch(login(email, password));
    }, 1000);
    // setLogging(false)
  };

  return (
    <div className="w-screen h-screen flex">
      <AccountsInfo />

      <div className="h-screen px-6 grow flex flex-col items-stretch space-y-12 py-6">
        <div className="text-right text-base tracking-tight">
          Need new account? <NavLink to="/signup">Sign up free</NavLink>
        </div>
        <div className="h-3/4 w-96 self-center flex flex-col items-center shrink-0">
          <div className="text-center leading-10">
            <span className="font-sans font-medium text-2xl">Sign in</span>
          </div>
          {error ? (
            <div>
              <span className="text-red-600">
                Incorrect email or password. Please try again,
              </span>{" "}
              <span className="text-blue-600"> reset your password, </span>{" "}
              <span className="text-red-600">or</span>{" "}
              <span className="text-blue-600">sign up</span>
            </div>
          ) : null}
          <div className="basis-5/6 ">
            <form method="POST" onSubmit={(e) => onSubmit(e)}>
              <div className="flex flex-col space-y-8 items-center mt-4 p-2">
                <div className="flex flex-col space-y-1 items-start">
                  <label className="font-sans text-sm">Email</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    name="email"
                    onChange={(e) => onChange(e)}
                    value={email}
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1 items-start">
                  <div className="flex justify-between w-full">
                    <label className="font-sans text-sm">Password</label>
                    <span className="font-sans text-sm text-blue-700 hover:cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => onChange(e)}
                    value={password}
                    minLength="6"
                    autoComplete="off"
                    required
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black focus:border-blue-700"
                  />
                </div>

                <div className="">
                  <button
                    type="submit"
                    className="bg-red-600 text-white font-semibold font-sans w-96 h-11 rounded-md hover:cursor-pointer hover:bg-red-700"
                  >
                    {logging ? "Signing In..." : "Sign in"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
