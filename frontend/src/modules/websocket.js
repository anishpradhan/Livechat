export const wsConnect = (host) => ({type: "WS_CONNECT", host});
export const wsDisconnect = (host) => ({type: "WS_DISCONNECT", host});
export const createNewChatroomSession = (host, roomId) => ({type: "CREATE_CHATROOM_SESSION", host, roomId});
export const discardChatroomSession = (roomId) => ({type: "DISCARD_CHATROOM_SESSION", roomId});
export const newMessage = (from, message, roomId) => ({type: "NEW_MESSAGE", from, message, roomId});
export const joinChatSocket = (roomId, agentId) => ({type: "JOIN_CHAT_SOCKET", roomId, agentId});
export const hasReadMessage = (roomId, sender) => ({type: "HAS_READ_MESSAGE", roomId, sender});

export const wsConnected = (host) => ({ type: "WS_CONNECTED", host });
export const wsDisconnected = (host) => ({ type: "WS_DISCONNECTED", host });
