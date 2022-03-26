import React from 'react';

const ChatStart = (timeStamp) => {
    // const dateTime = new Intl.DateTimeFormat('en-US', {month: 'short', day: '2-digit', year:'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(timeStamp));
    return (
        <div className="flex items-center justify-between">
            <hr className=' basis-4/12 h-2'/>
              <span className="text-xs basis-4/12 text-gray-400 font-semibold">Chat Started: {timeStamp} </span>
              <hr className=' basis-4/12 h-2'/>
        </div>
    );
};

export default ChatStart;