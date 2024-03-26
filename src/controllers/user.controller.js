import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
// Send media to cloudinary //
import {uploadOnCloudinary} from '../utils/cloudinary.js';
// Models User //
import {User} from '../models/user.models.js';
import { response } from 'express';

// Steps register path
// get user request
// check all fields are filled
// check if user already exists
// check for avatar and cover image is required
// upload media to cloudinary
// create user object 
// remove password and refresh token from response
// final check is user created
// return response
export const registerUser = asyncHandler(async(req, res)=>{
    const {username, email, fullName, password} = req.body;
    if ([username, email, fullName, password].some(field => { field?.trim() === ""})) {
        throw new ApiError(400, "All Fields are required")
    };
    if(!email?.trim().includes("@")){
        throw new ApiError(400, "Invalid email")
    };
    if(email !== email.toLowerCase() || email !== email.replaceAll(" ")){
        throw new ApiError(400, "email must be in lowercase or remove spaces")
    };
    if(username !== username.replaceAll(" ")){
        throw new ApiError(400, "remove spaces in username")
    };
    if(password.length<8){
        throw new ApiError(400, "password must be above 8 digits")
    }

    const existedUser = await User.findOne({
        // mongoDb operator
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with username or email is already exists");
    };

    // console.log("req.files", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files?.coverImage) && req.files?.coverImage.length>0){
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatarUploaded = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUploaded = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatarUploaded){
        throw new ApiError(400, "Avatar file is required")
    }

    const newDBUser = await User.create({
        username,
        email,
        fullName,
        avatar: avatarUploaded.url,
        coverImage: coverImageUploaded.url,
        password
    });
    const createdUser = await User.findById(newDBUser._id).select('-password -refreshToken');
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.")
    };

    return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"))
});