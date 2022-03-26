import React from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getChatList, unloadChat } from "../../store/actions/message";
import { useSelector } from "react-redux";
import Contact from "./Contact";
import ChatCategory from "./ChatCategory";

const ChatList = ({ toggle, setToggle }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChatList());
    return () => {
      dispatch(unloadChat());
    };
  }, []);

  const pendingChatList = useSelector((state) => state.message.pendingChatList);
  const allChatList = useSelector((state) => state.message.allChatList);

  let pendingChats = pendingChatList.map((c) => (
    
    <Contact
      key={c.id}
      name={c.name}
      chatURL={`${c.id}`}
      last_message = {c.last_message_field}
      setToggle={setToggle}
      totalUnreadMessages={`${c.total_unread_messages}`}
    />
  ));

  const totalPending = pendingChatList.length;
  const totalChat = allChatList.length;

  let allChats = allChatList.map((c) => (
    <Contact
      key={c.id}
      name={c.name}
      chatURL={`${c.id}`}
      last_message = {c.last_message_field}
      setToggle={setToggle}
      totalUnreadMessages={`${c.total_unread_messages}`}
    />
  ));

  return (
    <div
      className={`h-screen w-full lg:basis-3/12 overflow-y-auto ${
        toggle ? "sm:flex hidden" : "flex"
      } flex flex-col items-stretch bg-[#F3F7F9] border-r-2`}
    >
      <div className="border-b-2 p-3 flex items-center space-x-2">
        <span className="font-semibold text-lg">Chats</span>
      </div>
      <ChatCategory
        categoryName={"Unassigned Chats"}
        chatList={pendingChats}
        totalChats={totalPending}
      />
      <ChatCategory
        categoryName={"Active Chats"}
        chatList={allChats}
        totalChats={totalChat}
      />
    </div>
  );
};

export default ChatList;
