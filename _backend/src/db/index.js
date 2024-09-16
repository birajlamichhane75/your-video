import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () =>{
    try {
        let connectionInfo = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Database connection Successful");
        
        console.log(connectionInfo.connection.host);
        
    } catch (error) {
        console.log("Error",error)
    }
}