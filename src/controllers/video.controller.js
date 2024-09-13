import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadResult, uploadVideoFile } from "../utils/cloudinary.js";

const uploadVideos = asyncHandler(async (req, res) => {
  // get title desc from user
  // if any field is empty throw error
  // upload videos and thumbnail in cloudinary 
  // check if video is uploaded in cloudinary
  // save url in database 

  try {
    const { title, desc } = req.body;
    if (!title || !desc) {
      throw new ApiError(401, "Title and description cannot be empty")
    }
    const videoPath = await req.file?.path;
    const upload = await uploadVideoFile(videoPath);
    // const thumbnailPath = await uploadResult(req.files?.thumbnail[0].path);

    if (!upload.url) {
      throw new ApiError(400, "Video not found")
    }

    const owner = await User.findById(req.user._id).select("-password -refreshToken");
    const video = await Video.create({
      title: title,
      desc: desc,
      video: upload.url,
      // thumbnail:thumbnailPath.url,
      owner,

    })

    return res.status(200).json(new ApiResponse(200, video, "Video uploaded successfully"))

  } catch (error) {
    console.log(error, "error while uploading video");
    throw new ApiError(400, error)
  }

})

const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find();
    // console.log("Video details",videos);
    return res.status(200).json(new ApiResponse(200, videos, "Retrive video data successfully"))

  } catch (error) {
    console.log(error);
    throw new error("Error in getting videos")

  }
})

const EditVideoDetails = asyncHandler(async (req, res) => {
  try {
    const { videoID } = await req.params;
    const { title, desc } = await req.body;

    if (!videoID) {
      throw new ApiError(400, "Could not find the video")
    }

    if (!(title || desc)) {
      throw new ApiError(400, "Title or desc is missing")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoID, {
      $set: {
        title,
        desc
      }
    }, { new: true })

    console.log(updatedVideo);
    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video details updated successfully"))


  } catch (error) {
    console.log(error);

    throw new ApiError(400, "Error while editing")
  }
})

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const {videoID} = await req.params;
    if (!videoID) {
      throw new ApiError(400, "VideoID not found")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoID);

    return res.status(200).json(new ApiResponse(200,{success:true},"Video Deleted successfully"))


  } catch (error) {
    console.log(error);
    
    throw new ApiError(400, "Error in deleting video")
  }
})



export {
  uploadVideos,
  getAllVideos,
  EditVideoDetails,
  deleteVideo
}