import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    // take title and description from user
    // check if title is empty
    // save playlist to database with owner

    try {
        const { title, desc } = req.body;

        if (!title) {
            throw new ApiError(400, "Title not found")
        }

        const playlist = await Playlist.create({
            title,
            desc,
            owner: req.user
        })

        if (!playlist) {
            throw new ApiError(400, "Couldnot create playlist")
        }

        res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"))

    } catch (error) {
        throw new ApiError(400, "Error in creating playlist")

    }
})

const getPlaylist = asyncHandler(async (req, res) => {
    // get playlistID from params
    // find the playlist using playlistID from database
    // check if playlist exist or not
    // send the playlist as response
    try {

        const { playlistID } = req.params;

        if (!playlistID) {
            throw new ApiError(400, "Playlist ID not found")
        }

        const playlist = await Playlist.findById(playlistID);
        if (!playlist) {
            throw new ApiError(400, "playlist not found")
        }

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist retrive successfully"))
    } catch (error) {
        throw new ApiError(400, "Error while getting playlist")

    }


})

const addToPlaylist = asyncHandler(async(req,res)=>{
    // get playlistID and videoID from params 
    // check if any field are empty
    // add the video in the playlist
    // send response

    try {
        const {playlistID,videoID} = req.params;
    
        if(!(playlistID && videoID)){
            throw new ApiError(400, "PlaylistID or Video Id not found")
        }
    
        const playlist = await Playlist.findById(playlistID);
        if(!playlist){
            throw new ApiError(404,"playlist not found")
        }
    
        const video = await Video.findById(videoID);
    
        if(!video){
            throw new ApiError(404,"Video not found")
        }
    
        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistID,{
            $push:{
                videos:video
            }
        })
    
        return res.status(200).json(new ApiResponse(200,updatedPlaylist,"Video added successfully to playlist"))
    } catch (error) {
        throw new ApiError(400,"Error in adding video to playlist")
        
    }

})

const removeFromPlaylist = asyncHandler(async(req,res)=>{
    try {
        const {playlistID,videoID} = req.params;
    
        if(!(playlistID && videoID)){
            throw new ApiError(400, "PlaylistID or Video Id not found")
        }
        
        const video = await Video.findById(videoID);
    
        if(!video){
            throw new ApiError(404,"Video not found")
        }

        const playlist = await Playlist.findByIdAndUpdate(playlistID,{
            $pull:{
                videos:videoID
            }
        })

        return res.status(200).json(new ApiResponse(200,playlist,"Successfully removed from playlist"))
        
    
    } catch (error) {
        throw new ApiError(400,"Error in removing playlist")
    }
})


export { createPlaylist,getPlaylist,addToPlaylist,removeFromPlaylist }