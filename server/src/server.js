// call mongoDB Connection
// call express
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
dotenv.config({path:"./.env"});
import {app, port} from './app.js';

connectDB()
.then(()=>{
    app.on("error", ()=>{
        console.log("Error with express", error);
        throw error;
    });
    app.listen(port, ()=>{
        console.log("Server is running at port:",process.env.port);
    });
})
.catch(err=>{console.log("Failed to run server.", err)});