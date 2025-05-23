import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {Comment} from "../models/comment.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary, deleteOnCloudinary} from "../utils/cloudinary.js"


//TODO: get all videos based on query, sort, pagination
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    // console.log(userId);
    const pipeline = [];

    // for using Full Text based search u need to create a search index in mongoDB atlas
    // you can include field mapppings in search index eg.title, description, as well
    // Field mappings specify which fields within your documents should be indexed for text search.
    // this helps in seraching only in title, desc providing faster search results
    // here the name of search index is 'search-videos'
    if(query){
        pipeline.push({
            $search:{
                index:"search-videos",
                text:{
                    query: query,
                    path: ["title", "description"]
                }
            }
        });
    };
    if(userId){
        if(!isValidObjectId(userId)){
            // throw new ApiError(400, "Invalid userId");
            res.status(400).json({ error: "Invalid userId", success:"false" });
        }
        pipeline.push({
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    };

    // fetch videos only that are set isPublished as true
    pipeline.push({ $match: { isPublished: true } });

    //sortBy can be views, createdAt, duration
    //sortType can be ascending(-1) or descending(1)
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            "avatar.url": 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$ownerDetails"
        }
    )

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const video = await Video.aggregatePaginate(videoAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Videos fetched successfully"));
})

// TODO: get video, upload to cloudinary, create video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if ([title, description].some((field) => field?.trim() === "")) {
        // throw new ApiError(400, "All fields are required");
        res.status(400).json({ error: "All fields are required", success:"false" });
    }

    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if (!videoFileLocalPath) {
        // throw new ApiError(400, "videoFileLocalPath is required");
        res.status(400).json({ error: "videoFileLocalPath is required", success:"false" });
    };

    if (!thumbnailLocalPath) {
        // throw new ApiError(400, "thumbnailLocalPath is required");
        res.status(400).json({ error: "thumbnailLocalPath is required", success:"false" });
    };

    const videoFile = await uploadOnCloudinary(videoFileLocalPath, "media");
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "media");

    if (!videoFile) {
        // throw new ApiError(400, "Video file not found");
        res.status(400).json({ error: "Video file not found", success:"false" });
    };

    if (!thumbnail) {
        // throw new ApiError(400, "Thumbnail not found");
        res.status(400).json({ error: "Thumbnail not found", success:"false" });
    };

    const video = await Video.create({
        title,
        description,
        duration: videoFile.duration,
        videoFile: {
            url: videoFile.url,
            public_id: videoFile.public_id
        },
        thumbnail: {
            url: thumbnail.url,
            public_id: thumbnail.public_id
        },
        owner: req.user?._id,
        isPublished: false
    });

    const videoUploaded = await Video.findById(video._id);

    if (!videoUploaded) {
        // throw new ApiError(500, "videoUpload failed please try again !!!");
        res.status(500).json({ error: "videoUpload failed please try again !!!", success:"false" });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video uploaded successfully"));
})

//TODO: get video by id
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    // let userId = req.body;
    
    // userId = new mongoose.Types.ObjectId(userId)
    if (!isValidObjectId(videoId)) {
        // throw new ApiError(400, "Invalid videoId");
        res.status(400).json({ error: "Invalid videoId", success:"false" });
    }

    if (!isValidObjectId(req.user?._id)) {
        // throw new ApiError(400, "Invalid userId");
        res.status(400).json({ error: "Invalid userId", success:"false" });
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers"
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req.user?._id,
                                            "$subscribers.subscriber"
                                        ]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            "avatar.url": 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                "videoFile.url": 1,
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                comments: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1
            }
        }
    ]);

    if (!video) {
        // throw new ApiError(500, "failed to fetch video");
        res.status(500).json({ error: "failed to fetch video", success:"false" });
    }

    // increment views if video fetched successfully
    await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    });

    // add this video to user watch history
    await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: {
            watchHistory: videoId
        }
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, video[0], "video details fetched successfully")
        );
})

//TODO: update video details like title, description, thumbnail
const updateVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        // throw new ApiError(400, "Invalid videoId");
        res.status(400).json({ error: "Invalid videoId", success:"false" });
    }

    if (!(title && description)) {
        // throw new ApiError(400, "title and description are required");
        res.status(400).json({ error: "title and description are required", success:"false" });
    }

    const video = await Video.findById(videoId);

    if (!video) {
        // throw new ApiError(404, "No video found");
        res.status(404).json({ error: "No video found", success:"false" });
    }

    if (video?.owner.toString() !== req.user?._id.toString()) {
        // throw new ApiError(400,"You can't edit this video as you are not the owner");
        res.status(400).json({ error: "You can't edit this video as you are not the owner", success:"false" });
    }

    //deleting old thumbnail and updating with new one
    const thumbnailToDelete = video.thumbnail.public_id;

    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) {
        // throw new ApiError(400, "thumbnail is required");
        res.status(400).json({ error: "thumbnail is required", success:"false" });
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "media");

    if (!thumbnail) {
        // throw new ApiError(400, "thumbnail not found");
        res.status(400).json({ error: "thumbnail not found", success:"false" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: {
                    public_id: thumbnail.public_id,
                    url: thumbnail.url
                }
            }
        },
        { new: true }
    );

    if (!updatedVideo) {
        // throw new ApiError(500, "Failed to update video please try again");
        res.status(500).json({ error: "Failed to update video please try again", success:"false" });
    }

    if (updatedVideo) {
        await deleteOnCloudinary(thumbnailToDelete);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
})

//TODO: delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        // throw new ApiError(400, "Invalid videoId");
        res.status(400).json({ error: "Invalid videoId", success:"false" });
    }

    const video = await Video.findById(videoId);

    if (!video) {
        // throw new ApiError(404, "No video found");
        res.status(404).json({ error: "No video found", success:"false" });
    }

    if (video?.owner.toString() !== req.user?._id.toString()) {
        // throw new ApiError(400,"You can't delete this video as you are not the owner");
        res.status(400).json({ error: "You can't delete this video as you are not the owner", success:"false" });
    }

    const videoDeleted = await Video.findByIdAndDelete(video?._id);

    if (!videoDeleted) {
        // throw new ApiError(400, "Failed to delete the video please try again");
        res.status(400).json({ error: "Failed to delete the video please try again", success:"false" });
    }

    await deleteOnCloudinary(video.thumbnail.public_id); // video model has thumbnail public_id stored in it->check videoModel
    await deleteOnCloudinary(video.videoFile.public_id, "video"); // specify video while deleting video

    // delete video likes
    await Like.deleteMany({
        video: videoId
    })

     // delete video comments
    await Comment.deleteMany({
        video: videoId,
    })
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        // throw new ApiError(400, "Invalid videoId");
        res.status(400).json({ error: "Invalid videoId", success:"false" });
    };

    const video = await Video.findById(videoId);

    if (!video) {
        // throw new ApiError(404, "Video not found");
        res.status(404).json({ error: "Video not found", success:"false" });
    };

    if (video?.owner.toString() !== req.user?._id.toString()) {
        // throw new ApiError(400,"You can't toogle publish status as you are not the owner");
        res.status(400).json({ error: "You can't toogle publish status as you are not the owner", success:"false" });
    };

    const toggledVideoPublish = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video?.isPublished
            }
        },
        { new: true }
    );

    if (!toggledVideoPublish) {
        // throw new ApiError(500, "Failed to toogle video publish status");
        res.status(500).json({ error: "Failed to toogle video publish status", success:"false" });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isPublished: toggledVideoPublish.isPublished },
                "Video publish toggled successfully"
            )
        );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
