import React, { useState } from "react";
import AccountsInfo from "./AccountsInfo";
import { Navigate, NavLink } from "react-router-dom";
import { signup } from "../store/actions/auth";
import { useDispatch } from "react-redux";

const Signup = () => {
  const dispatch = useDispatch();
  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    company_name: "",
    domain: "",
    phone: "",
  });

  const {
    full_name,
    email,
    password,
    company_name,
    domain,
    phone,
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    dispatch(signup(full_name,
      email,
      password,
      company_name,
      domain,
      phone));
    setAccountCreated(true);

  };

  if (accountCreated) {
    return <Navigate to='/login' />;
};

  return (
    <div className="w-screen h-screen flex">
      <AccountsInfo />

      <div className="h-screen px-6 grow flex flex-col items-stretch space-y-12 py-6">
        <div className="text-right text-base tracking-tight">
          Already have an account? <NavLink to="/login">Login</NavLink>
        </div>
        <div className="h-3/4 w-96 self-center flex flex-col items-center shrink-0">
          <div className="text-center leading-10">
            <span className="font-sans font-medium text-2xl">
              Create your free account
            </span>
          </div>
          <div className="basis-5/6 ">
          <form onSubmit={e => onSubmit(e)}>
            <div className="flex flex-col space-y-8 items-center mt-4 p-2">
              
                <div className="flex flex-col space-y-1 items-start">
                  <span className="font-sans text-sm">Full Name</span>

                  <input
                    type="text"
                    placeholder="John Smith"
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black"
                    name="full_name"
                    value={full_name}
                    onChange = {e => onChange(e)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1 items-start">
                  <span className="font-sans text-sm">Business Email</span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black"
                    name="email"
                    value={email}
                    onChange={e => onChange(e)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1 items-start">
                  <span className="font-sans text-sm">Password</span>
                  <input
                    type="password"
                    placeholder="8 characters or more"
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black"
                    name="password"
                    value={password}
                    onChange={e => onChange(e)}
                    minLength="6"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1 items-start">
                  <span className="font-sans text-sm">
                    Your company name
                  </span>
                  <input
                    type="text"
                    placeholder="Company"
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black"
                    name="company_name"
                    value={company_name}
                    onChange={e => onChange(e)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1 items-start">
                  <span className="font-sans text-sm">
                    Your company website
                  </span>
                  <input
                    type="url"
                    placeholder="www.mywebsite.com"
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black"
                    name="domain"
                    autoCorrect="off"
                    autoCapitalize="none"
                    value={domain}
                    onChange={e => onChange(e)}
                    required

                  />
                </div>
                <div className="flex flex-col space-y-1 items-start">
                  <span className="font-sans text-sm">Mobile phone number</span>
                  <input
                    type="text"
                    value="+977"
                    placeholder="e.g. 999-999-9999"
                    className="border-1 border-[#bcc6d0] w-96 h-12 px-3 rounded-md hover:border-black"
                    onChange={e => onChange(e)}
                    name="phone"
                    value={phone}
                    maxLength="20"
                    required
                  />
                </div>
              

              <div className="">
                <input
                  type="submit"
                  value="Create Account"
                  className="bg-red-600 text-white font-semibold font-sans w-96 h-11 rounded-md hover:cursor-pointer hover:bg-red-700"
                />
              </div>
              
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
