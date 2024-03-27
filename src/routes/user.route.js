import { Router } from "express";
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';
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

// console.log(upload.fields)