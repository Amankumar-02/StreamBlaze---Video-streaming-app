import dotenv from 'dotenv';
dotenv.config({path: "./.env"});

import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from "morgan";

export const app = express();
export const port = process.env.PORT || 4000;

app.set("view engine", "ejs")

app.use(
    cors({
        // origin: process.env.CORS_ORIGIN,
        origin: ["http://localhost:5173", "*"],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials:true,
    })
);

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev")); //HTTP request logger middleware for node.js


import {userRoute} from './routes/user.route.js';
import {videoRouter} from "./routes/video.routes.js";
import {commentRouter} from "./routes/comment.routes.js";
import {dashboardRouter} from "./routes/dashboard.routes.js";
import { healthRouter } from './routes/healthcheck.routes.js';
import {likeRouter} from "./routes/like.routes.js";
import { playlistRouter } from './routes/playlist.routes.js';
import { subscriptionRouter } from './routes/subscription.routes.js';
import { tweetRouter } from './routes/tweet.routes.js';

// pass the user route
app.use("/api/v1/users", userRoute);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tweet", tweetRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
    // throw new Error(404)c
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});