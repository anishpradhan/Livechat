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
import { updateObject } from "../utility";

const initialState = {
  pendingChatList: [],
  allChatList: [],
  roomName: null,
  roomId: null,
  messages: [],
  agentExist: null,
  roomAgentAssigned: null,
  isTyping: false,
  totalUnreadMessages: 0,
};

const updateIsTyping = (state, action) => {
  if (state.roomId === action.chatId) {
    return updateObject(state, {
      isTyping: true
    })
  }
  else {
    return state;
  }
}
const updateFinishedTyping = (state, action) => {
  if (state.roomId === action.chatId) {
    return updateObject(state, {
      isTyping: false
    })
  }
  else {
    return state;
  }
}

const reOrderChatList = (state) => {
  return updateObject(state, {
    allChatList: [...state.allChatList].sort(
      (a, b) => new Date(b.last_sent_time) - new Date(a.last_sent_time)
    ),
  });
};


const newChatUpdate = (state, action) => {
  if (action.message.agentAssigned) {
    return updateObject(state, {
      allChatList: [action.message.chatRoom, ...state.allChatList],
    });
  } else {
    return updateObject(state, {
      pendingChatList: [action.message.chatRoom, ...state.pendingChatList],
    });
  }
};

const joinChatRoom = (state, action) => {
  const chatRoom = state.pendingChatList.find(
    (room) => room.id === action.chatId
  );
  const joinedChatRoom = { ...chatRoom, agents: action.agentId, total_unread_messages: 0 };
  const chatRoomIndex = state.pendingChatList.findIndex(
    (room) => room.id === action.chatId
  );
  state.pendingChatList.splice(chatRoomIndex, 1);

  return updateObject(state, {
    pendingChatList: state.pendingChatList,
    allChatList: [joinedChatRoom, ...state.allChatList],
    agentExist: true,
    messages: [action.joinedMsg, ...state.messages]
  })
}

const addMessage = (state, action) => {
  const roomIndex = state.allChatList.findIndex(
    (room) => room.id === action.message.room
  );

  console.log(roomIndex);
  const last_message_field = {
    message: action.message.message,
    sent_time: action.message.sent,
  };
  if (roomIndex !== -1) {
    if (state.roomId === action.message.room) {
      return updateObject(state, {
        messages: [action.message, ...state.messages],
        totalUnreadMessages: state.totalUnreadMessages + 1,
        allChatList: state.allChatList.map((obj, index) => {
          if (index === roomIndex) {
            if (action.message.agent === null) {
              return {
                ...obj,
                total_unread_messages: 0,
                last_sent_time: last_message_field.sent_time,
                last_message_field: last_message_field,
              };
            } else {
              return {
                ...obj,
                last_sent_time: last_message_field.sent_time,
                last_message_field: last_message_field,
              };
            }
          }
          return obj;
        }),
      });
    } else {
      return updateObject(state, {
        messages: [...state.messages],
        allChatList: state.allChatList.map((obj, index) => {
          if (index === roomIndex) {
            return {
              ...obj,
              total_unread_messages: parseInt(obj.total_unread_messages) + 1,
              last_sent_time: last_message_field.sent_time,
              last_message_field: last_message_field,
            };
          }
          return obj;
        }),
      });
    }
  }
  else {
    const roomIndex = state.pendingChatList.findIndex(
      (room) => room.id === action.message.room)
    if (state.roomId === action.message.room) {
      return updateObject(state, {
        messages: [action.message, ...state.messages],
        totalUnreadMessages: state.totalUnreadMessages + 1,
        pendingChatList: state.pendingChatList.map((obj, index) => {
          if (index === roomIndex) {
            if (action.message.agent === null) {
              return {
                ...obj,
                total_unread_messages: 0,
                last_sent_time: last_message_field.sent_time,
                last_message_field: last_message_field,
              };
            } else {
              return {
                ...obj,
                last_sent_time: last_message_field.sent_time,
                last_message_field: last_message_field,
              };
            }
          }
          return obj;
        }),
      });
    } else {
      return updateObject(state, {
        messages: [...state.messages],
        pendingChatList: state.pendingChatList.map((obj, index) => {
          if (index === roomIndex) {
            return {
              ...obj,
              total_unread_messages: parseInt(obj.total_unread_messages) + 1,
              last_sent_time: last_message_field.sent_time,
              last_message_field: last_message_field,
            };
          }
          return obj;
        }),
      });
    }

  }

};

const updateLastMsgReadStatus = (state, action) => {
  const roomIndex = state.allChatList.findIndex(
    (room) => room.id === action.chatId
  );
  return updateObject(state, {
    allChatList: state.allChatList.map((obj, index) => {
      if (index === roomIndex) {
        return { ...obj, total_unread_messages: 0 };
      }
      return obj;
    }),
  });
};

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
        roomName: payload.room_name,
        roomId: payload.room_id,
        messages: payload.last_10_messages,
        agentExist: payload.room_agent_exists,
        roomAgentAssigned: payload.room_agent,
        totalUnreadMessages: payload.total_unread_messages,
      };

    case ADD_MESSAGE:
      return addMessage(state, action);
    case REORDER_CHATLIST:
      return reOrderChatList(state);
    case NEW_CHAT_UPDATE:
      return newChatUpdate(state, action);
    case SET_MESSAGES:
      return setMessages(state, action);
    case HAS_READ:
      return updateLastMsgReadStatus(state, action);
    case JOIN_CHAT_ROOM:
      return joinChatRoom(state, action);
    case CHAT_PAGE_UNLOAD:
      return {
        ...state,
        pendingChatList: [],
        allChatList: [],
        messages: [],
        roomName: null,
        roomId: null,
        agentExist: null,
        roomAgentAssigned: null,
        isTyping: false,
        totalUnreadMessages: 0,
      };
    case JOIN_CHAT:
      return {
        ...state,
        roomAgentAssigned: payload.agent
      };
    case IS_TYPING:
      return updateIsTyping(state, action);
    case FINISHED_TYPING:
      return updateFinishedTyping(state, action);

    default:
      return state;
  }
}
