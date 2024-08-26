import mongoose from "mongoose";
import express from 'express';
import { DB_NAME } from "./constant.js";
import dotenv from 'dotenv';
import { connectDB } from "./db/index.js";

dotenv.config({
    path:'./.env'
})

const app = express();
connectDB();

// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.error("Db connection failed");
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`Listining to port ${process.env.PORT}`)
//         })

//     } catch (error) {
//         console.log(`Failed to connect ${error}`);   
//         process.exit(1);
//     }
// })()