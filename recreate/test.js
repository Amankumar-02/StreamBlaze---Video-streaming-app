//db
import mongoose from 'mongoose';

 export const connect = async()=>{
    try {
        const instance = await mongoose.connect("url");
        console.log(instance.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

//server
import dotenv from 'dotenv';
dotenv.config({path: "./.env"});
import {app, port} from 'app.js';
connect()
.then(()=>{
    app.get("/", (req, res)=>{
        res.send("Hello World!!")
    })
    app.listen(port, ()=>{
        console.log("running")
    })
})
.catch((err)=>{console.log(err)})

// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = 8000;
app.use(cors({
    origin: process.env.crossOrigin,
    credentials: true,
}))
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(express.static("public"));
app.use(cookieParser());

// utils
export const asyncHandler = (requestHandler)=>{
    return async(req, res, next)=>{
        return await Promise.resolve(requestHandler(req, res, next))
        .catch((err)=>{next(err)});
    }
}

export class ApiError extends Error{
    constructor(
        statusCode, message="Something went wrong", error=[], stack="",
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.error = error
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export class ApiResponse{
    constructor(statusCode, data, message="Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.status = statusCode<400
    }
}

// cloudinary
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
          
cloudinary.config({ 
  cloud_name: 'youtubeclone002', 
  api_key: '582261373265155', 
  api_secret: 'mfVaKEc1BMlvpahzM01iumQ2CaM' 
});

export const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath){return null;}
        const response  = await cloudinary.uploader.upload(localFilePath,
        {resource_type: "auto"});
        fs.unlinkSync(localFilePath);
        return response ;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}


// multer
import multer from 'multer';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


// user
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){next()};
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    isPasswordCorrect: async function(password){
        return await bcrypt.compare(password, this.password);
    },
    accessToken: function(){
        return jwt.sign({
            _id : this._id,
            username: this.username,
            fullName: this.fullName,
            email: this.email
        }, process.env.secret, {expiredIn : process.env.expire})
    },
    refreshToken: function(){
        return jwt.sign({
            _id : this._id,
        }, process.env.secret, {expiredIn : process.env.expire})
    },
};

// video
videoSchema.plugin(mongooseAggregatePaginate);
