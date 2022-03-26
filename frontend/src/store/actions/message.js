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
    HAS_READ
} from '../actions/types';

export const unloadChat = () => {
  return{
    type: CHAT_PAGE_UNLOAD,
  }
} 
export const addMessage = (message) => {
  return {
    type: ADD_MESSAGE,
    message: message
  };
  
};

export const setMessages = (messages) => {
  return {
    type: SET_MESSAGES,
    message: messages
  };
}

export const updateLastMsgReadStatus = () => async(dispatch) => {
  dispatch({
      type: HAS_READ
  })
}
export const isTyping = () => async(dispatch) => {
  dispatch({
      type: IS_TYPING
  })
}
export const finishedTyping = () => async(dispatch) => {
  dispatch({
      type: FINISHED_TYPING
  })
}

export const getChatList = () => async(dispatch) => {
    const config = {
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json',
          'X-DTS-SCHEMA': `${localStorage.getItem('tenant_uuid')}`
        }
      };
  
      try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chatlist/`, config);
        dispatch({
          type: RETRIEVE_CHATLIST_SUCCESS,
          payload: res.data
        });
      }catch (err){
        dispatch({
          type: RETRIEVE_CHATLIST_FAIL
        });
      }
}

export const getChatMessages = (chatID) => async(dispatch) => {
    const config = {
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('access')}`,
          'Accept': 'application/json',
          'X-DTS-SCHEMA': `${localStorage.getItem('tenant_uuid')}`
        }
      };

      try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_messages/?chat_id=${chatID}`, config);
        dispatch({
          type: RETRIEVE_MESSAGES_SUCCESS,
          payload: res.data
        });
      }catch (err){
        dispatch({
          type: RETRIEVE_MESSAGES_FAIL
        });
      }
};

export const joinChat = (chatID) => async(dispatch) => {
  const config = {
      headers : {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`,
        'Accept': 'application/json',
        'X-DTS-SCHEMA': `${localStorage.getItem('tenant_uuid')}`
      }
    };

    const body = JSON.stringify({'room_id' : chatID});

    try{
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/join_chat/`, body, config);
      console.log(res.data);
      dispatch({
        type: JOIN_CHAT,
      });
      dispatch(getChatList());
      dispatch(getChatMessages(chatID));

    }catch (err){
      dispatch({
        type: JOIN_CHAT_FAIL
      });
    }
};