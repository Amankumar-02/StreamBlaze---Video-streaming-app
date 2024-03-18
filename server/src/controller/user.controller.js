import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password } = req.body;
    // console.log("req.body", req.body)

    if ([userName, fullName, email, password].some(text => text?.trim() === "")) {
        throw new ApiError(400, `All fields are required`)
    };

    if (!email?.trim().includes("@") || email?.trim().includes(" ")) {
        throw new ApiError(500, `Invalid Email`)
    };

    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    });
    // console.log("existedUser", existedUser)
    if (existedUser) {
        throw new ApiError(409, `User with Email or UserName already exists.`)
    };

    // console.log("req.files", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, `Avatar file is required.`)
    };

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, `Avatar file is required.`)
    };

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, `Something went wrong while registering the
   user.`)
    };

    // console.log(`Email: ${email}, UserName: ${userName}, FullName: ${fullName}, Password: ${password}`);

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully.")
    );
});