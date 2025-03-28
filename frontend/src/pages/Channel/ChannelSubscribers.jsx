import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChannelSubscribers } from "../../store/Slices/subscriptionSlice";
import { Avatar, Button } from "../../components";
import { Link } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";

function ChannelSubscribers() {
    const dispatch = useDispatch();
    const channelId = useSelector((state) => state.user.profileData?._id);
    const subscribers = useSelector(
        (state) => state.subscription.channelSubscribers
    );

    useEffect(() => {
        if (channelId) {
            dispatch(getUserChannelSubscribers(channelId));
        }
    }, [dispatch, channelId]);

    return (
        <>
            {!subscribers.length? (<>
                <div className="h-[70%] flex flex-col items-center justify-center">
              <FaPlayCircle size={45} className="text-purple-500" />
              <h1 className="text-white mt-4 text-lg">
                Nobody Subscribe you
              </h1>
            </div>
            </>):(<>
                {subscribers?.map((subscriber) => (
                <Link
                    to={`/channel/${subscriber?.subscriber?.username}/videos`}
                    key={subscriber?.subscriber?._id}
                    className="flex border-b border-slate-500 px-3 py-1 justify-between items-center text-white"
                >
                    <div className="flex gap-3 items-center">
                        <Avatar
                            src={subscriber?.subscriber?.avatar.url}
                            channelName={subscriber?.subscriber?.username}
                        />
                        <div>
                            <h5 className="text-sm">
                                {subscriber?.subscriber?.username}
                            </h5>
                            <span className="text-xs text-slate-400">
                                {subscriber?.subscriber?.subscribersCount}{" "}
                                Subscribers
                            </span>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-[#A855F7] text-black text-xs py-1 px-2">
                            {subscriber?.subscriber?.subscribedToSubscriber
                                ? "Subscribed"
                                : "subscribe"}
                        </Button>
                    </div>
                </Link>
            ))}
            </>)}
        </>
    );
}

export default ChannelSubscribers;
