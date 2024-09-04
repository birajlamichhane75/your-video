import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async(req,res,next)=>{      // if res is not is use we can replace res with _
    try {
        
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(400,"Access token not found");
        }

        const decodedUser = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
       
        
        const user = await User.findById(decodedUser._id);
        if(!user){
            throw new ApiError(400,"Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

