// Express

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import morgan from "morgan";

export const app = express();
export const port = process.env.PORT || 4000;

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(express.static("public"));
app.use(cookieParser());
// app.use(morgan("dev")); //HTTP request logger middleware for node.js