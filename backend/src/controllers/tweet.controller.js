import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

//TODO: create tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        // throw new ApiError(400, "content is required");
        res.status(400).json({ error: "content is required", success:"false" });
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id,
    });

    if (!tweet) {
        // throw new ApiError(500, "failed to create tweet please try again");
        res.status(500).json({ error: "failed to create tweet please try again", success:"false" });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet created successfully"));
})

// TODO: get user tweets
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        // throw new ApiError(400, "Invalid userId");
        res.status(400).json({ error: "Invalid userId", success:"false" });
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
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
                            "avatar.url": 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likeDetails",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likeDetails",
                },
                ownerDetails: {
                    $first: "$ownerDetails",
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likeDetails.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                ownerDetails: 1,
                likesCount: 1,
                createdAt: 1,
                isLiked: 1
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
})

//TODO: update tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;

    if (!content) {
        // throw new ApiError(400, "content is required");
        res.status(400).json({ error: "content is required", success:"false" });
    }

    if (!isValidObjectId(tweetId)) {
        // throw new ApiError(400, "Invalid tweetId");
        res.status(400).json({ error: "Invalid tweetId", success:"false" });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        // throw new ApiError(404, "Tweet not found");
        res.status(404).json({ error: "Tweet not found", success:"false" });
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        // throw new ApiError(400, "only owner can edit thier tweet");
        res.status(400).json({ error: "only owner can edit thier tweet", success:"false" });
    }

    const newTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
            },
        },
        { new: true }
    );

    if (!newTweet) {
        // throw new ApiError(500, "Failed to edit tweet please try again");
        res.status(500).json({ error: "Failed to edit tweet please try again", success:"false" });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newTweet, "Tweet updated successfully"));
})

//TODO: delete tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        // throw new ApiError(400, "Invalid tweetId");
        res.status(400).json({ error: "Invalid tweetId", success:"false" });
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        // throw new ApiError(404, "Tweet not found");
        res.status(404).json({ error: "Tweet not found", success:"false" });
    }

    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        // throw new ApiError(400, "only owner can delete thier tweet");
        res.status(400).json({ error: "only owner can delete thier tweet", success:"false" });
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponse(200, {tweetId}, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
