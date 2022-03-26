import { useRef } from "react";
import * as actions from "../modules/websocket";
import {
  addMessage,
  getChatMessages,
  getChatList,
  isTyping,
  finishedTyping,
} from "../store/actions/message";

const wsMiddleware = () => {
  let socket = null;

  // const roomName = useSelector(state => state.message.roomName);

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
    // console.log("receiving server message", payload);
    

    switch (payload.command) {
      case "new_message":
        store.dispatch(addMessage(payload.message));
        break;
      case "update_chat_list":
        store.dispatch(getChatList());
        break;
      case "has_read_status":
        store.dispatch(getChatMessages(payload.chatId));
        break;
      case "is_typing":
        store.dispatch(isTyping());
        break;
      case "finished_typing":
        store.dispatch(finishedTyping());
        break  
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
        // setTimeout(() => {
        //   console.log("reconnecting...");
        //   store.dispatch(actions.wsConnect(action.host));
        // },1000);
        break;
      
      // case "WS_DISCONNECTED":
      //   // if (socket !== null) {
      //   //   socket.close();
      //   // }
      //   // socket = null;
      //   console.log("websocket purely disconnected");
      //   setTimeout(() => {
      //     console.log("reconnecting...");
      //     store.dispatch(actions.wsConnect(action.host));
      //   },1000);
      //   break;

      case "NEW_MESSAGE":
        // console.log('sending a message', action.message, action.from);
        socket.send(
          JSON.stringify({
            command: "new_message",
            from: action.from,
            message: action.message,
            chatId: action.roomId,
            
          })
        );
        break;
      
      case "HAS_READ":
        socket.send(
          JSON.stringify({
            command:"set_message_read",
            chatId: action.roomId,
            sender: action.sender
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
