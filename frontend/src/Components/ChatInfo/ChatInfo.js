import React from 'react';

const ChatInfo = ({time, info}) => {
    return (
        <div className="flex flex-col justify-center py-3">
            
            <div className="flex items-center justify-between">
            <hr className=' basis-2/5 h-2'/>
              <span className="text-xs basis-1/5 text-gray-400 font-semibold">{time}</span>
              <hr className=' basis-2/5 h-2'/>
            </div>
            <span className='text-xs text-gray-400 font-semibold'>{info}</span>
            
        </div>
    );
};

export default ChatInfo;