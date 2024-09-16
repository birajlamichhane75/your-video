import { Comment } from "../models/comments.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getComment = asyncHandler(async(req,res)=>{
    // get video ID from params
    // find comment by the video id in database
    // send res

    const {videoID} = req.params;

    const comments = await Comment.find({
        video:videoID,
    })

    if(!comments){
        throw new ApiError(400,"Comment not found")
    }

    return res.status(200).json(new ApiResponse(200,comments,"Successfully retrive comment"))
})

const commentOnVideo = asyncHandler(async(req,res)=>{   

    // get videoID from params and content from body
    // check if comment is empty
    // save the comment in database
    // send res

    const {videoID} = req.params;
    const {content} = req.body;

    if(!content){
        throw new ApiError(400,"Comment not found");
    }

    const comment = await Comment.create({
        content,
        video:videoID,
        owner:req.user,
    })

    return res.status(200).json(new ApiResponse(200,comment,"Successfully commented"))


})

const updateComment = asyncHandler(async(req,res)=>{
    // get videoID from params
    // get comment id from body (send comment id while clicking in three dots)
    // find comment in database and check weather the user has done this comment
    // findbyid and update comment
    // send res

    try {
        const {videoID} = req.params;
        const {commentID,content} = req.body;
        
        if(!commentID){
            throw new ApiError(400,"Comment not found")
        }

        const comment = await Comment.findById(commentID);
        if(comment.owner !== req.user._id){
            throw new ApiError("Not a owner of comment")
            
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentID,{
            $set:{
                content
            }
        },{new:true})

        return res.status(200).json(new ApiResponse(200,updateComment,"Comment updated successfully"))
        
    } catch (error) {
        throw new ApiError(400,"Error in updating comment")
        
    }


})

const deleteComment = asyncHandler(async(req,res)=>{
try {
            const {videoID} = req.params;
            const {commentID} = req.body;
    
            if(!commentID){
                throw new ApiError(400,"Comment not found")
            }
    
            const comment = await Comment.findById(commentID);
            if(comment.owner !== req.user._id){
                throw new ApiError("Not a owner of comment")
            }
    
            const deletedComment = await Comment.findOneAndDelete(commentID);
    
            return res.status(200).json(new ApiResponse(200,deletedComment,"Comment deleted successfully"))
} catch (error) {
    throw new ApiError(400,"Error in deleting comment")
}
})




export {commentOnVideo,getComment,updateComment,deleteComment}