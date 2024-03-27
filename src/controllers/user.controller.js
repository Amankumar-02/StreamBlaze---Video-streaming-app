import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
// Send media to cloudinary //
import {uploadOnCloudinary} from '../utils/cloudinary.js';
// Models User //
import {User} from '../models/user.models.js';

// custom method for access and refresh token
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const userData = await User.findById(userId);
        // generating tokens for registered users
        const accessToken = userData.generateAccessToken();
        const refreshToken = userData.generateRefreshToken();
        // save tokens to db
        userData.refreshToken = refreshToken;
        await userData.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token."); 
    }
};

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

    const userExists = await User.findOne({
        // mongoDb operator
        $or: [{username}, {email}]
    })
    if(userExists){
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

// Login Todos
// req.body
// username or email
// find the user
// password check
// acces and refresh token generate
// send token to cookies
export const loginUser = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;
    if(!(username || email)){
        throw new ApiError(400, "username and email is required");
    };
    const dbUser = await User.findOne({
        $or: [{username}, {email}]
    });
    if(!dbUser){
        throw new ApiError(404, "User is not found")
    };
    const checkPassword = await dbUser.isPasswordCorrect(password);
    if(!checkPassword){
        throw new ApiError(401, "Invalid user credentials")
    };

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(dbUser._id);
    const loggedInUser = await User.findById(dbUser._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User Logged in Successfully"))
});

// Logout Todos
export const logoutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        // here req.user is get from the jwtVerify middleware
        req.user._id,
        {
            // clear the refresh token from db
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true,
        }
        );
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out successfully"))
});
