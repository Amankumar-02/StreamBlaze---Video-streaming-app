import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from '../controllers/user.controller.js';
// multer to store media in local //
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const userRoute = Router();

userRoute.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);
userRoute.route("/login").post(loginUser);

// secured routes
userRoute.route("/logout").post(verifyJWT, logoutUser);
userRoute.route("/refreshToken").post(refreshAccessToken);
userRoute.route("/changeCurrentPassword").post(verifyJWT, changeCurrentPassword);
userRoute.route("/updateAccountDetails").patch(verifyJWT, updateAccountDetails);
userRoute.route("/updateUserAvatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
userRoute.route("/updateUserCoverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);