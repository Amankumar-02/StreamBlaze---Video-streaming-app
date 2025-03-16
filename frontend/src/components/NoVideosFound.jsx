import React from "react";
import { FaPlayCircle } from "react-icons/fa";

const NoVideosFound = ({ text }) => {
    return (
        <div className="flex flex-col py-20 items-center text-white h-screen">
            <FaPlayCircle
                size={45}
                className="text-purple-500"
            />
            <p className="mt-4 text-lg">There are no videos available here.</p>
            <p className="">{text && text}</p>
        </div>
    );
};

export default NoVideosFound;
