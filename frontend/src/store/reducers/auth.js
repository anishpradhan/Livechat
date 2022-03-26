import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_FAIL,
  LOGOUT_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  USER_LOADING,
  USER_LOAD_SUCCESS,
  USER_LOAD_FAIL,
  RETRIEVE_CHATLIST_SUCCESS,
  RETRIEVE_CHATLIST_FAIL,
  
} from "../actions/types";

const initialState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isLoading: true,
  isAuthenticated: false,
  user: {},
  tenant_uuid: localStorage.getItem("tenant_uuid"),
  error: false,
  errorMessage: '',
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        error: false,
        errorMessage: '',
      };
    case AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("access", payload.access);
      localStorage.setItem("refresh", payload.refresh);
      localStorage.setItem("tenant_uuid", payload.tenant_uuid);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
        tenant_uuid: payload.tenant_uuid,
        error: false,
        errorMessage: ''
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        error: false,
        errorMessage: ''
      }  
    case USER_LOADING:
      return{
        ...state,
        isLoading: true
      }
    case USER_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: payload,
      };
    case USER_LOAD_FAIL:
      return {
        ...state,
        isLoading: false,
        user: {},
      };
    case LOGIN_FAIL:
    case SIGNUP_FAIL:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("tenant_uuid");
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: {},
        access: null,
        refresh: null,
        tenant_uuid: null,
        error: true,
        errorMessage: payload.detail 
      };
    case LOGOUT_SUCCESS:  
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("tenant_uuid");
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: {},
        access: null,
        refresh: null,
        tenant_uuid: null,
      };
    case LOGOUT_FAIL:
      return state;
    default:
      return state;

    case RETRIEVE_CHATLIST_SUCCESS:
    case RETRIEVE_CHATLIST_FAIL:
      return state;
  }
}
