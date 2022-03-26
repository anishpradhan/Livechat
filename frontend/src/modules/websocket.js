export const wsConnect = (host) => ({type: "WS_CONNECT", host});
export const wsDisconnect = (host) => ({type: "WS_DISCONNECT", host});
export const newMessage = (from, message, roomId) => ({type: "NEW_MESSAGE", from, message, roomId});
export const hasRead = (roomId, sender) => ({type: "HAS_READ", roomId, sender});

export const wsConnected = (host) => ({ type: "WS_CONNECTED", host });
export const wsDisconnected = (host) => ({ type: "WS_DISCONNECTED", host });
