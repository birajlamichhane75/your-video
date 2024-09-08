import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadResult from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'

const registerUser = asyncHandler(async (req, res) => {

    // take data from frontend
    // validation: check if any field is empty
    // check if user already exist
    // upload image in cloudinary
    // check if avatar is upload in cloudinary
    // create objects and upload in database
    // remove password and refreshtoken
    // send response

    try {
        const { fullName, username, email, password } = await req.body

        if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(408, "Every field is required")
        }

        const existUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        console.log("this is user", existUser);


        if (existUser) {
            throw new ApiError(408, "User already exist")
        }

        // console.log("files",req);
        console.log(req.files);

        const avatarLocalPath = req.files?.avatar[0].path;
        // const coverImageLocalPath = req.files?.coverImage[0].path
        let coverImageLocalPath;

        if (req.files && Array.isArray(req.files.coverImage)) {
            coverImageLocalPath = req.files.coverImage[0].path
        }

        let avatar = await uploadResult(avatarLocalPath);
        let coverImage = await uploadResult(coverImageLocalPath);

        if (!avatar.url) {
            throw new ApiError(400, "Avatar not find")
        }

        let user = await User.create({
            username: username.toLowerCase(),
            fullName,
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
        })

        const createUser = await User.findById(user._id).select(" -password -refreshToken")

        if (!createUser) {
            throw new ApiError(500, "Something went wrong while registering")
        }

        return res.status(201).json(
            new ApiResponse(200, createUser, "Success")
        )


    } catch (error) {
        console.log("error uc", error);

    }

})


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        let accessToken = user.generateAccessToken();
        let refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(400, "error in generating token")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    // take usename email password from user res.body
    // check is any is empty
    // compare if email and password matches in database
    // if matcher give accesstoken and refresh token through cookie
    //  res

    try {
        const { email, password, username } = await req.body

        console.log("lskfs", email, password);


        if (!email && !username) {
            throw new ApiError(403, "Fields cannot be empty")
        }

        let user = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (!user) {
            return new ApiError(404, "User not found")
        }

        const userMatch = await user.isPasswordCorrect(password)

        if (!userMatch) {
            return new ApiError(404, "Incorrect Password");
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200,
                {
                    user: user,
                    accessToken,
                    refreshToken
                },
                "successfully login"
            ))

    } catch (error) {
        console.log("error login", error);

    }
})

const logOutUser = asyncHandler(async (req, res) => {
    try {
        const user = await req.user;

        await User.findByIdAndUpdate(user._id, {
            $set: {
                refreshToken: undefined
            }
        });

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, user, "successfully logout"))

    } catch (error) {
        console.log(error);

        throw new ApiError(400, "error in logging out")
    }

})

const refreshAccessToken = asyncHandler(async (req, res) => {

    // get refreshtoken from frontend cookies
    // get decoded information by jwt.verify
    // get user form database using decoded._id
    // get refresh token from db and compare
    // if they are not same send error
    // if they are same generate new token and save in cookie

    const incommingRefreshtoken = await req.cookies.RefreshToken || req.body.refreshToken;
    if (!incommingRefreshtoken) {
        throw new ApiError(400, "Refresh token not found");
    }

    const decoded = jwt.verify(incommingRefreshtoken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
        throw new ApiError(400, "Invalid refreshtoken");
    }

    const user = await User.findById(decoded._id);

    if (!user) {
        throw new ApiError(400, "Invalid token")
    }

    const newRefreshToekn = user.refreshToken;

    if (newRefreshToekn !== incommingRefreshtoken) {
        throw new ApiError(400, "Expired token or already used")
    }

    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken(user._id);

    return res.status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToekn }, "successfully refresh access token"))

})

const changePassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = await req.body;

        const user = req.user;
        if (!user) {
            throw new ApiError(400, "User not found in req")
        }
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Incorrect old password")
        }

        const updatesUser = await User.findByIdAndUpdate(user._id, {
            $set: {
                password: newPassword
            }
        }, { new: true });

        return res.status(200)
            .json(new ApiResponse(200, updatesUser, "password changed successfully"));

    } catch (error) {
        console.log("error Change password", error);
        throw new ApiError(401, error)

    }


})

const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        return res.status(200)
            .json(new ApiResponse(200, req.user, "Success"))

    } catch (error) {
        throw new ApiError(error || "error in getting current user")
    }
})

const updateDetails = asyncHandler(async (req, res) => {
    const { email, fullName } = await req.body;

    if (!email || !fullName) {
        throw new ApiError(400, "email or fullname not found")
    }

    const updatedUser = await User.findOneAndUpdate(req.user._id, {
        $set: {
            email,
            fullName
        }
    }, { new: true }).select("-password")

    if (!updatedUser) {
        throw new ApiError(400, "Cannot update the email please check again")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedUser, "successfully updated details"))

})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = await req.file.path;
    if (!avatarLocalPath) {
        throw new ApiError(401, "Avatar local path not found")
    }

    const uploadedAvatar = await uploadResult(avatarLocalPath);

    if (!uploadedAvatar.url) {
        throw new ApiError(400, "Error in uploading avatar")
    }

    const updatesUser = User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: uploadedAvatar.url
        }
    }, { new: true })

    return res.status(200)
        .json(new ApiResponse(200, updatesUser, "Successfully updated Avatar"))


})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = await req.file.path;
    if (!coverImageLocalPath) {
        throw new ApiError(401, "Cover Image local path not found")
    }

    const uploadCI = await uploadResult(coverImageLocalPath);

    if (!uploadCI.url) {
        throw new ApiError(400, "Error in uploading COver Image")
    }

    const updatesUser = User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverImage: uploadCI.url
        }
    }, { new: true })

    return res.status(200)
        .json(new ApiResponse(200, updatesUser, "Successfully updated Cover Image"))


})

const getUserChannelProfile = asyncHandler(async(req,res)=>{

    // get username from url as a params
    // get user using $match in User schema in database
    // use $addfield to add subscribers, subscribeTo and isSubscribe to User
    // to count subscribers count the number of channel from sucsription schema - $size:subscriber
    // to count subscribeTo get total subscribers = user  - size:$channel

    const {username} = await req.params;

    if(!username.trim()){
        throw new ApiError(400,"username not found")
    }

    const userProfile = await User.aggregate([
        {
            $match:{
                username:username,
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribeTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size: "$subscribers"
                },
                
                subscribeToCount:{
                    $size: "$subscribeTo"
                },

                isSubscribe:{
                    $cond:{
                       if:[req.user?._id, "$subscribers.subscriber"],
                       then:true,
                       else:false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                email:1,
                username:1,
                avatar:1,
                coverImage:1,
                subscriberCount:1,
                subscribeToCount:1,
                isSubscribe:1,

            }
        }
    ])

    if(!userProfile?.length){
        throw new ApiError(400,"Channel does not exist")
    }

    return res.status(200).json( new ApiResponse(200,userProfile,"successfully retuen user profile details"))
})

const getWatchHistory = asyncHandler(async(req,res)=>{

    // find the user using $match
    // lookup to video add video id to watch history id 
    // again lookup inside previous to owner and get details of owner


    const watchHistory = await User.aggregate([
        {
            $match:{
                _id: mongoose.Schema.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from:"video",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"user",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner"
                        }
                    }
                ]
            }
        }
    ])
})

const uploadVideos = asyncHandler(async(req,res)=>{
    const {video,title,desc,thumbnail} = req.body;
    // const user = req.user;

    


})

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
};