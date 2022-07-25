import React from 'react';

const ChatStart = ({timeStamp}) => {
    return (
        <div className="flex items-center justify-between py-5">
            <hr className=' basis-4/12 h-2'/>
              <span className="text-xs basis-4/12 text-gray-400 font-semibold">Chat Started: {timeStamp} </span>
              <hr className=' basis-4/12 h-2'/>
        </div>
    );
};

export default ChatStart;