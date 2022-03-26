import React, { useState } from "react";
import ChatList from "./ChatList";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Chat = () => {
  
  const [toggleChat, setToggleChat] = useState(false);

  const toggle = () => {
    setToggleChat(!toggleChat);
  };

  var emptyID = false;
  var redirectURL = null;
  const location = useLocation();
  const currentLocation = location.pathname;
  const pendingList = useSelector((state) => state.message.pendingChatList);
  const allChats = useSelector((state) => state.message.allChatList);

  try {
    var firstChatID;
    if (pendingList.length > 0) {
      firstChatID = pendingList[0].id;
    } else {
      firstChatID = allChats[0].id;
    }

    redirectURL = currentLocation + "/" + firstChatID;

    if (location.pathname === "/dashboard/chat") {
      emptyID = true;
    }
  } catch (e) {
    emptyID = false;
  }

  return emptyID ? (
    <Navigate to={redirectURL} />
  ) : (
    <div className="h-full flex">
 
        <ChatList toggle={toggleChat} setToggle={toggle} />
        <Outlet context={[toggleChat, setToggleChat]} />

    </div>
  );
};
export default Chat;
