import { Like } from "../models/likes.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async(req,res)=>{
   try {
     const {videoID} = await req.params;
     const {like} = await req.body;
 
     if(like){
         const likeDets = await Like.create({
             video:videoID,
             likedBy:req.user
         })
 
         return res.status(200).json(new ApiResponse(200,likeDets, "successfully liked the video"))
     }
 
     
   } catch (error) {
    console.log("errorrr",error);
    
    throw new ApiError(400,"Error in Like")
    
   }

})

const getLikedVideos = asyncHandler(async(req,res)=>{
    try {
        const likedVideos = await Like.aggregate([
            {
                $match:{
                    likedBy : req.user._id
                }
            },
            {
                $lookup:{
                    from:"Video",
                    localField:"video",
                    foreignField:"_id",
                    as:"likedVideos",
                }
            },
            {
                $project:{
                    likedVideos:1,

                }
            }
        ])

        return res.status(200).json(new ApiResponse(200,likedVideos,"Successfully get liked videos"))
    } catch (error) {
        throw new ApiError(400,"Error in getting liked videos")
        
    }
})




export {toggleLike,getLikedVideos}