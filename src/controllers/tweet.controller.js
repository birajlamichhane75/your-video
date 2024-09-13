import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadTweet = asyncHandler(async(req,res)=>{
    // take content from user 
    // check if content is empty or not
    // save the content in database with tweetby

    
    try {
        const {caption} = await req.body;
    
        if(!caption){
            throw new ApiError(400, "Caption cannot be empty")
        }
    
        const tweet = await Tweet.create({
            content:caption,
            owner:req.user._id,
        })


        return res.status(200).json(new ApiResponse(200, tweet, "Tweet uploaded successfully"))
    } catch (error) {
        console.log(error);
        throw new ApiError(400,"Error in uploadindg tweet")
        
    }
})

const viewTweet = asyncHandler(async(req,res)=>{
    try {
        const tweet = await Tweet.find();

        if(!tweet){
            throw new ApiError(400,"Not any tweet yet")
        }

        return res.status(200).json(new ApiResponse(200,tweet,"Tweet retrive successfully"))
    } catch (error) {
        throw new ApiError(400,"Error in viewing tweet")
        
    }
})


export {uploadTweet, viewTweet}