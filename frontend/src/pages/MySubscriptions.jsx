import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribedChannels } from "../store/Slices/subscriptionSlice";
import { Link } from "react-router-dom";
import { VideoList, Avatar } from "../components";
import { FaPlayCircle } from "react-icons/fa";

function MySubscriptions() {
    const dispatch = useDispatch();
    const subscriptions = useSelector(
        (state) => state.subscription?.mySubscriptions
    );
    const subscriberId = useSelector((state) => state.auth?.userData?._id);
    useEffect(() => {
        if (subscriptions) {
            dispatch(getSubscribedChannels(subscriberId));
        }
    }, [dispatch, subscriberId]);
    window.scrollTo(0, 0);
    
    return (
      <>
        {!subscriptions.length ? (
          <>
            <div className="h-[70%] flex flex-col items-center justify-center">
              <FaPlayCircle size={45} className="text-purple-500" />
              <h1 className="text-white mt-4 text-lg">
                You did not subscribe to anyone
              </h1>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-4 p-4 text-white items-center bg-[#222222]">
              {subscriptions?.map((subscription) => (
                <div
                  key={subscription?.subscribedChannel?._id}
                  className="flex flex-col items-center"
                >
                  <Avatar
                    src={subscription?.subscribedChannel?.avatar.url}
                    channelName={subscription?.subscribedChannel?.username}
                  />
                  <h5 className="text-xs mt-1">
                    {subscription?.subscribedChannel?.username}
                  </h5>
                </div>
              ))}
            </div>

            <div className="text-white mb-20 sm:mb-0 w-full grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 overflow-y-scroll">
              {subscriptions?.map((subscription, index) => (
                <div key={index}>
                  {subscription?.subscribedChannel?.latestVideo ? (
                    <>
                      <Link
                        to={`/watch/${subscription?.subscribedChannel?.latestVideo?._id}`}
                        key={subscription?.subscribedChannel?._id}
                      >
                        {subscription?.subscribedChannel?.latestVideo && (
                          <VideoList
                            key={subscription?.subscribedChannel?._id}
                            avatar={subscription?.subscribedChannel?.avatar.url}
                            duration={
                              subscription?.subscribedChannel?.latestVideo
                                ?.duration
                            }
                            title={
                              subscription?.subscribedChannel?.latestVideo
                                ?.title
                            }
                            thumbnail={
                              subscription?.subscribedChannel?.latestVideo
                                ?.thumbnail?.url
                            }
                            createdAt={
                              subscription?.subscribedChannel?.latestVideo
                                ?.createdAt
                            }
                            views={
                              subscription?.subscribedChannel?.latestVideo
                                ?.views
                            }
                            channelName={
                              subscription?.subscribedChannel?.username
                            }
                            videoId={
                              subscription?.subscribedChannel?.latestVideo?._id
                            }
                          />
                        )}
                      </Link>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
}

export default MySubscriptions;
