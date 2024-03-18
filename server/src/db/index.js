// mongoDB Connetion METHOD
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

export const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        // console.log("connectionInstance", connectionInstance.connections[0].host);
        console.log(`MongoDB Connected!! DB HOST: ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
};