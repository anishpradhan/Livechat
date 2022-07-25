import axios from "axios";
import {
  RETRIEVE_CHATLIST_SUCCESS,
  RETRIEVE_CHATLIST_FAIL,
  RETRIEVE_MESSAGES_SUCCESS,
  RETRIEVE_MESSAGES_FAIL,
  ADD_MESSAGE,
  SET_MESSAGES,
  CHAT_PAGE_UNLOAD,
  JOIN_CHAT,
  JOIN_CHAT_FAIL,
  IS_TYPING,
  FINISHED_TYPING,
  HAS_READ,
  NEW_CHAT_UPDATE,
  REORDER_CHATLIST,
  JOIN_CHAT_ROOM,
} from "../actions/types";

export const unloadChat = () => {
  return {
    type: CHAT_PAGE_UNLOAD,
  };
};

export const newChatUpdate = (message) => {
  return {
    type: NEW_CHAT_UPDATE,
    message: message,
  };
};

export const addMessage = (message) => {
  return {
    type: ADD_MESSAGE,
    message: message,
  };
};

export const joinChatRoom = (chatId, agentId, joinedMsg) => {
  return {
    type: JOIN_CHAT_ROOM,
    chatId: chatId,
    agentId: agentId,
    joinedMsg: joinedMsg
  };
};

export const reOrderChatList = () => {
  return {
    type: REORDER_CHATLIST,
  };
};

export const setMessages = (messages) => {
  return {
    type: SET_MESSAGES,
    message: messages,
  };
};

export const updateLastMsgReadStatus = (chatId, sender) => {
  return {
    type: HAS_READ,
    chatId: chatId,
    sender: sender,
  };
};

export const isTyping = (chatId) => async (dispatch) => {
  dispatch({
    type: IS_TYPING,
    chatId: chatId
  });
};
export const finishedTyping = (chatId) => async (dispatch) => {
  dispatch({
    type: FINISHED_TYPING,
    chatId: chatId
  });
};

export const getChatList = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
      Accept: "application/json",
      "X-DTS-SCHEMA": `${localStorage.getItem("tenant_uuid")}`,
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/chatlist/`,
      config
    );
    dispatch({
      type: RETRIEVE_CHATLIST_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RETRIEVE_CHATLIST_FAIL,
    });
  }
};

export const getChatMessages = (chatID) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
      Accept: "application/json",
      "X-DTS-SCHEMA": `${localStorage.getItem("tenant_uuid")}`,
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/get_messages/?chat_id=${chatID}`,
      config
    );
    dispatch({
      type: RETRIEVE_MESSAGES_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RETRIEVE_MESSAGES_FAIL,
    });
  }
};

export const joinChat = (chatID) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
      Accept: "application/json",
      "X-DTS-SCHEMA": `${localStorage.getItem("tenant_uuid")}`,
    },
  };

  const body = JSON.stringify({ room_id: chatID });

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/join_chat/`,
      body,
      config
    );
    dispatch({
      type: JOIN_CHAT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOIN_CHAT_FAIL,
    });
  }
};
