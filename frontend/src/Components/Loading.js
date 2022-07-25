import React from 'react';
import {AiOutlineLoading3Quarters} from 'react-icons/ai';

const Loading = () => {
    return (
        <div className='flex justify-center items-center h-screen w-screen'>
            <span className="animate-spin">
            <AiOutlineLoading3Quarters size={40} color={"blue"}/></span>
        </div>
    );
};

export default Loading;