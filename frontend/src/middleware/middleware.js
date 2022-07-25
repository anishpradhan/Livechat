import * as actions from "../modules/websocket";
import {
  addMessage,
  isTyping,
  finishedTyping,
  reOrderChatList,
  newChatUpdate,
  updateLastMsgReadStatus,
  joinChatRoom,
} from "../store/actions/message";

const wsMiddleware = () => {
  let socket = null;

  const onOpen = (store) => (event) => {
    console.log("websocket open", event.target.url);
    store.dispatch(actions.wsConnected(event.target.url));
  };

  const onClose = (store) => () => {
    console.log("websocket closed");
    store.dispatch(actions.wsDisconnected());
  };

  const onMessage = (store) => (event) => {
    const payload = JSON.parse(event.data);
    const state = store.getState();

    switch (payload.command) {
      case "new_message":
        store.dispatch(addMessage(payload.message));
        store.dispatch(reOrderChatList());
        break;
      case "update_chat_list":
        store.dispatch(newChatUpdate(payload.message));
        break;
      case "join_chat":
        store.dispatch(joinChatRoom(payload.chatId, payload.agentId, payload.joinedMsg));
        break;
      case "has_read_status":
        store.dispatch(updateLastMsgReadStatus(payload.chatId, payload.sender));
        break;
      case "is_typing":
        if (!state.message.isTyping && state.message.roomId === payload.chatId) {
          store.dispatch(isTyping(payload.chatId));
        }
        break;
      case "finished_typing":
        if (state.message.isTyping && state.message.roomId === payload.chatId) {
          store.dispatch(finishedTyping(payload.chatId));
        }
        break;
      default:
        return;
    }
  };

  return (store) => (next) => (action) => {
    switch (action.type) {
      case "WS_CONNECT":
        if (socket !== null) {
          socket.close();
        }
        socket = new WebSocket(action.host);
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);

        break;

      case "WS_DISCONNECT":
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        console.log("websocket disconnected");
        break;

      case "WS_CONNECTED":
        console.log("websocket purely connected");
        break;
      case "WS_DISCONNECTED":
        console.log("websocket purely disconnected");
        setTimeout(() => {
          console.log("reconnecting...");
          store.dispatch(actions.wsConnect(action.host));
        }, 2000);

        break;

      case "CREATE_CHATROOM_SESSION":
        var interval = setInterval(() => {
          if (socket === null) {
            console.log("socket is null");
          } else {
            console.log("Creating a chatroom session", action.roomId);
            socket.send(
              JSON.stringify({
                command: "create_new_chatroom_session",
                chatId: action.roomId,
              })
            );
            clearInterval(interval);
          }
        }, 500);
        break;

      case "DISCARD_CHATROOM_SESSION":
        console.log("Discarding a chatroom session", action.roomId);

        socket.send(
          JSON.stringify({
            command: "discard_chatroom_session",
            chatId: action.roomId,
          })
        );
        break;

      case "NEW_MESSAGE":
        // console.log("sending a message", action.message, action.from);

        socket.send(
          JSON.stringify({
            command: "new_message",
            from: action.from,
            message: action.message,
            chatId: action.roomId,
          })
        );
        break;

      case "JOIN_CHAT_SOCKET":
        socket.send(
          JSON.stringify({
            command: "join_chat",
            chatId: action.roomId,
            agentId: action.agentId,
          })
        );
        break;

      case "HAS_READ_MESSAGE":
        socket.send(
          JSON.stringify({
            command: "set_message_read",
            chatId: action.roomId,
            sender: action.sender,
          })
        );

        break;

      default:
        // console.log('the next action:', action);
        return next(action);
    }
  };
};

export default wsMiddleware();
