import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadResult from "../utils/cloudinary.js";

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

        console.log("this is user",existUser);
        

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


const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        
        let accessToken = user.generateAccessToken();
        let refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:true})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(400,"error in generating token")
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

        console.log("lskfs",email,password);
        
    
        if (!email && !username) {
            throw new ApiError(403, "Fields cannot be empty")
        }

        let user = await User.findOne({
            $or: [{ email }, { username }]
        })

        if(!user){
            return new ApiError(404,"User not found")
        }

        const userMatch = await user.isPasswordCorrect(password)

        if(!userMatch){
            return new ApiError(404,"Incorrect Password");
        }

        const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly:true,
            secure:true
        }

        return res.status(200)
        .cookie('accessToken',accessToken,options)
        .cookie('refreshToken',refreshToken,options)
        .json(new ApiResponse(200,
            {
                user:user,
                accessToken,
                refreshToken
            },
            "successfully login"
        ))

    } catch (error) {
        console.log("error login",error);
        
    }
})

const logOutUser = asyncHandler(async(req,res)=>{
    try {
        const user = await req.user;
    
        await User.findByIdAndUpdate(user._id,{
            $set:{
                refreshToken:undefined
            }
        });

        const options = {
            httpOnly:true,
            secure:true
        }
    
        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,user,"successfully logout"))

    } catch (error) {
        console.log(error);
        
        throw new ApiError(400,"error in logging out")
    }
      
})
export { registerUser, loginUser,logOutUser };