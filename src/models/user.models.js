import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, 'username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: [true, 'fullname is required'],
        index: true,
    },
    avatar:{
        type: String,
        required: true,
    },
    coverImage:{
        type: String,
        required: true,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
    password:{
        type: String,
        required: [true, 'Password is required'],
        min: [8, "Password must be more than 8 digits."]
    },
    refreshToken:{
        type: String,
    },
}, {timestamps:true});

// encrypt the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){return next()};
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare the db and client password
userSchema.methods.isPasswordCorrect = async function(passwordReceive){
    return await bcrypt.compare(passwordReceive, this.password);
};

// access token generator using jwt
userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id: this._id,
            username: this._username,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
};

// refresh token generator using jwt
userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
};

export const User = mongoose.model("User", userSchema);


// userSchema.methods = {
//     // compare the db and client password
//     comparePassword : async function(plainTextPassword){
//         return await bcrypt.compare(plainTextPassword, this.password);
//     },
//     // access token generator using jwt
//     generateAccessToken: function(){
//         return jwt.sign(
//             {
//                 _id: this._id,
//                 email: this.email,
//                 username: this.username,
//                 fullName: this.fullName
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             {
//                 expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//             }
//         )
//     },
//     // refresh token generator using jwt
//     generateRefreshToken: function(){
//         return jwt.sign(
//             {
//                 _id: this._id,
//             },
//             process.env.REFRESH_TOKEN_SECRET,
//             {
//                 expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//             }
//         )
//     },
// };