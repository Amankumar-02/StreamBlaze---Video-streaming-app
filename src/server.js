import connectToDB from './dataBase/index.js';
import dotenv from 'dotenv';
import {app, port} from './app.js';
dotenv.config({path: './.env'});

connectToDB()
.then(()=>{
    // app.get("/", (req, res)=>{
    //     res.send("Hello")
    // })
    app.listen(port, ()=>{
        console.log("Server is Running on port: ",port);
    })
})
.catch((error)=>
    {console.log('Server is not running Error: ', error);}
);
