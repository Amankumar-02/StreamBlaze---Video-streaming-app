import { Router } from "express";
import { registerUser } from '../controllers/user.controller.js';
// multer to store media in local //
import { upload } from '../middlewares/multer.middleware.js';

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

// console.log(upload.fields)