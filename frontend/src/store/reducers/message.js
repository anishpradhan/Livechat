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
} from "../actions/types";
import { updateObject } from "../utility";

const initialState = {
  pendingChatList: [],
  allChatList: [],
  roomName : null,
  messages : [],
  agentExist : null,
  isTyping: false,  
};

const addMessage = (state, action) => {
  return updateObject(state, {
    messages: [action.message, ...state.messages],
  });
};

const updateLastMsgReadStatus = (state, action) => {
  return updateObject(state, {
    // messages : [...state.messages[0].receiverHasRead = true, ...state.messages.slice(1)]
    messages: 'yoooo',
  })
}

const setMessages = (state, action) => {
  return updateObject(state, {
    messages: action.message.reverse(),
  });
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case RETRIEVE_CHATLIST_SUCCESS:
      return {
        ...state,
        allChatList: payload.all_rooms,
        pendingChatList: payload.pending_rooms,
      };
    case RETRIEVE_CHATLIST_FAIL:
      return {
        ...state,
      };
    case RETRIEVE_MESSAGES_FAIL:
    case JOIN_CHAT_FAIL:  
      return {
        ...state,
      };
    case RETRIEVE_MESSAGES_SUCCESS:
      return {
        ...state,
        roomName : payload.room_name,
        messages: payload.last_10_messages,
        agentExist: payload.room_agent_exists
      };

    case ADD_MESSAGE:
      return addMessage(state, action);
    case SET_MESSAGES:
      return setMessages(state, action);
    case HAS_READ:
      console.log('executed');

      return updateLastMsgReadStatus(state, action);
    case CHAT_PAGE_UNLOAD:
      return {
        ...state,
        pendingChatList: [],
        allChatList: [],
        messages: [],
        roomName: null,
        agentExist: null,
        isTyping: false
      };
    case JOIN_CHAT:
      return {
        ...state,
      }
    case IS_TYPING:
      return {
        ...state,
        isTyping: true
      }  
    case FINISHED_TYPING:
      return {
        ...state,
        isTyping: false
      }  
        
    default:
      return state;
  }
}
