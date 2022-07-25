import React, { useEffect, useState, useLayoutEffect } from "react";
import ChatStart from "../ChatInfo/ChatStart.js";
import SentMessage from "./SentMessage.js";
import RecieveMessage from "./RecieveMessage.js";
import { useDispatch, useSelector } from "react-redux";
import { getChatMessages, joinChat } from "../../store/actions/message.js";
import { useOutletContext, useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import {
  newMessage,
  createNewChatroomSession,
  hasReadMessage,
  discardChatroomSession,
  joinChatSocket,
} from "../../modules/websocket";
import ChatDetail from "./ChatDetail.js";
import ChatInfo from "../ChatInfo/ChatInfo.js";
import NewRoomFormDetail from "../ChatInfo/NewRoomFormDetail.js";

const ChatWindow = () => {
  const { ref, inView } = useInView();

  const [toggleChat, setToggleChat] = useOutletContext();

  const [sendMessage, setSendMessage] = useState("");

  const dispatch = useDispatch();

  var isTyping = useSelector((state) => state.message.isTyping);
  var totalUnreadMessages = useSelector((state) => state.message.totalUnreadMessages);

  let { chatID } = useParams();
  const host = `${
    process.env.REACT_APP_SOCKET_URL
  }/${chatID}/?token=${localStorage.getItem("access")}`;
  
  useEffect(() => {
    dispatch(getChatMessages(chatID));
    setSendMessage("");
    dispatch(createNewChatroomSession(host, chatID));
    return () => {
      dispatch(discardChatroomSession(chatID));
    };
  }, [chatID]);

  useLayoutEffect(() => {
    if(inView) {
      if (totalUnreadMessages !== "0") {
        dispatch(hasReadMessage(chatID, "agent"));
      }
    }
  }, [totalUnreadMessages])

  const username = useSelector((state) => state.message.roomName);
  const messages = useSelector((state) => state.message.messages);
  const currentUsername = useSelector((state) => state.auth.user.username);
  const agentExists = useSelector((state) => state.message.agentExist);
  const agentAssigned = useSelector((state) => state.auth.user.id);

  const messageChangeHandler = (event) => {
    setSendMessage(event.target.value);
  };

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (sendMessage.trim() !== "") {
      dispatch(newMessage(currentUsername, sendMessage, chatID));
      setSendMessage("");
    }
  };

  const handlePressEnter = (event) => {
    if (event.key === "Enter") {
      sendMessageHandler(event);
    }
  };
  let messageChats = messages.map((message, index) => {
    const renderTimestamp = (timestamp) => {
      let prefix = "";
      // const d = new Date();
      const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const timeDiff = Math.round(
        (new Date().getTime() - new Date(timestamp).getTime()) / 60000
      );

      if (timeDiff < 24 * 60) {
        // less than 24 hours ago
        const dateTime = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(timestamp));
        prefix = `${dateTime}`;
      } else if (timeDiff < 7 * 24 * 60 && timeDiff > 24 * 60) {
        // less than 7 days ago
        // prefix = `${Math.round(timeDiff / (60 * 24))}d`;
        const dateTime = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(timestamp));
        prefix = `${weekday[new Date(timestamp).getDay()] + " " + dateTime}`;
      } else if (timeDiff >= 7 * 24 * 60) {
        // less than 7 days ago
        // prefix = `${Math.round(timeDiff / (60 * 24))}d`;
        const dateTime = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(timestamp));
        prefix = `${dateTime}`;
      } else {
        prefix = `${new Date(timestamp)}`;
      }
      return prefix;
    };
    if (message.type === "info") {
      return (
        <ChatInfo
          key={message.id}
          time={renderTimestamp(message.sent)}
          info={message.message}
        />
      );
    }
    else if (message.type === 'started_info'){
      console.log(renderTimestamp(message.sent));
      return (<ChatStart key={message.id} timeStamp={renderTimestamp(message.sent)} />);

    }
    else if(message.type === 'chat_form'){
      return (<NewRoomFormDetail key={message.id} name={"Anish"} detail={"DEtails in te dadf"} /> )
    }
    else {
      if (message.name === username) {
        var receiveMessageContinue = false;
        var samePreviousReceiver = false;

        try {
          if (messages[index + 1].name === username) {
            receiveMessageContinue = true;
          }
        } catch {
          receiveMessageContinue = false;
        }

        if (index !== 0) {
          const previousReceivedMessage = messages[index - 1];
          if (previousReceivedMessage.name !== username) {
            samePreviousReceiver = false;
          } else {
            samePreviousReceiver = true;
          }
        }

        var lastMsg = false;
        if (index === 0) {
          lastMsg = true;
        }
        return (
          <RecieveMessage
            key={message.id}
            username={username}
            message={message.message}
            receiveMessageContinue={receiveMessageContinue}
            lastMessage={lastMsg}
            samePreviousReceiver={samePreviousReceiver}
            timeStamp={renderTimestamp(message.sent)}
          />
        );
      } else {
        var sentMessageContinue = false;
        var samePreviousSender = false;

        try {
          if (messages[index + 1].name !== username) {
            sentMessageContinue = true;
          }
        } catch {
          sentMessageContinue = false;
        }

        if (index !== 0) {
          const previousMessage = messages[index - 1];
          if (previousMessage.name === username) {
            samePreviousSender = false;
          } else {
            samePreviousSender = true;
          }
        }

        lastMsg = false;
        if (index === 0) {
          lastMsg = true;
        }

        return (
          <SentMessage
            key={message.id}
            message={message.message}
            messageStatus={message.receiverHasRead}
            sentMessageContinue={sentMessageContinue}
            lastMessage={lastMsg}
            samePreviousSender={samePreviousSender}
            timeStamp={renderTimestamp(message.sent)}
            // hasSeen = {message.receiverHasRead}
          />
        );
      }
    }
  });

  return (
    <div
    ref={ref}
      className={`sm:flex sm:flex-row w-full ${
        toggleChat ? "block" : "hidden"
      } `}
    >
      <div className="h-full grow flex flex-col items-stretch">
        <div className="border-b-2 p-3 flex items-center justify-center">
          <span
            className="block sm:hidden hover:cursor-pointer"
            onClick={() => {
              setToggleChat(!toggleChat);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </span>
          <span className="font-semibold text-lg grow">{username}</span>
        </div>

        <div className="h-5/6 w-full flex flex-col-reverse p-3 space-y-[1px] overflow-y-auto">
          {!agentExists ? (
            <div className="py-4">
              <button
                onClick={() => {
                  dispatch(joinChat(chatID));
                  dispatch(joinChatSocket(chatID, agentAssigned ));
                  
                }}
                className="w-[90px] rounded-lg border-0 px-3 py-2 text-sm font-semibold font-sans bg-blue-500 text-white hover:bg-blue-600"
              >
                Join Chat
              </button>
            </div>
          ) : null}


          {/* <NewRoomFormDetail name={"Anish"} detail={"Hello dear how are you doing my love Hello dear how are you doing my love Hello dear how are you doing my love"} /> */}


          {isTyping ? (
            <div className={`flex items-top space-x-2 space-y-[0px]`}>
              <span
                className={`w-8 h-8 shrink-0 rounded-full border-4 bg-gray-200`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-300"
                  fill="grey"
                  viewBox="0 0 22 22"
                  stroke="grey"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <div className="flex flex-col items-start max-w-2xl ">
                <span className="text-sm text-gray-500">{username}</span>
                <span
                  className={`px-3 py-1 flex-shrink bg-[#F2F3F4] rounded-l-md rounded-r-3xl text-left rounded-bl-3xl`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          ) : null}

          {/* <ChatStart /> */}

          {messageChats}
        </div>

        <div className="w-full h-1/6 px-3">
          <div className="border-2 w-full h-32 rounded-lg flex flex-col space-y-2 justify-between">
            {agentExists ? (
              <input
                type="text"
                id="chat-message-input"
                placeholder="Type message"
                onChange={messageChangeHandler}
                value={sendMessage}
                required
                className="rounded-lg text-sm border-transparent focus:border-transparent focus:ring-0"
                onKeyDown={handlePressEnter}
              />
            ) : (
              <input
                type="text"
                id="chat-message-input"
                placeholder="Please join chat to continue chatting"
                onChange={messageChangeHandler}
                value={sendMessage}
                required
                disabled
                className="rounded-lg text-sm border-transparent focus:border-transparent focus:ring-0"
                onKeyDown={handlePressEnter}
              />
            )}
            <div className="flex justify-between items-center">
              {/* <span className='border-2 relative left-4'>Upload</span> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 relative left-4 hover:cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                  clipRule="evenodd"
                />
              </svg>
              {agentExists ? (
                <button
                  id="chat-message-submit"
                  onClick={sendMessageHandler}
                  className="border-0 rounded-sm p-1 w-[70px] relative right-4 bottom-2 text-sm font-semibold font-sans bg-blue-500 text-white hover:bg-blue-600"
                >
                  Send
                </button>
              ) : (
                <button
                  disabled
                  id="chat-message-submit"
                  onClick={sendMessageHandler}
                  className="border-0 rounded-sm p-1 w-[70px] relative right-4 bottom-2 text-sm font-semibold font-sans bg-blue-500 text-white hover:bg-blue-600 disabled:bg-slate-400"
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F3F7F9] w-[460px] max-w-[460px] overflow-y-auto hidden lg:block">
        <ChatDetail username={username} />
      </div>
    </div>
  );
};

export default ChatWindow;
