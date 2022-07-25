import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_FAIL,
  USER_LOADING,
  USER_LOAD_SUCCESS,
  USER_LOAD_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
} from "./types";

export const checkAuthenticated = () => async(dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ token: localStorage.getItem("access") });
    try {  
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify/`,
        body,
        config,
      );
      if (res.data.code !== "token_not_valid") {

        dispatch({
          type: AUTHENTICATED_SUCCESS,
        });

      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
}};



export const load_user = () => async(dispatch) => {
  dispatch({
    type: USER_LOADING,
  })

  if(localStorage.getItem('access')) {
    const config = {
      headers : {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json',
        'X-DTS-SCHEMA': `${localStorage.getItem('tenant_uuid')}`
      }
    };

    try{
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
      dispatch({
        type: USER_LOAD_SUCCESS,
        payload: res.data
      });
    }catch (err){
      dispatch({
        type: USER_LOAD_FAIL
      });
    }
  }else {
    dispatch({
      type: USER_LOAD_FAIL
    });
  }
}

export const login = (email, password) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/create/`,
        body,
        config
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(load_user());
    } catch (err) {
      console.log(err);
      dispatch({
        type: LOGIN_FAIL,
        payload: err
      });
    }
  };

export const signup = ( full_name,
  email,
  password,
  company_name,
  domain,
  phone) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({  full_name,
      email,
      password,
      company_name,
      domain,
      phone });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/tenants/register/register_tenant/`,
        body,
        config
      );
      console.log(res);
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err)
      dispatch({
        type: SIGNUP_FAIL,
      });
    }
  };


export const logout = () => async (dispatch) => {
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  };
