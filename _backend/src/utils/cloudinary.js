import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// uploading file from localstorage to cloudinary

// configuration from cloudinary website docs
const uploadResult = async (localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRETE
    })

    // Uploading image from server to cloudinary
    try {
        if (!localFilePath) return null;

        let uploadFile = await cloudinary.uploader.upload(localFilePath);
        console.log(uploadFile.url);
        fs.unlinkSync(localFilePath)
        return uploadFile;

    } catch (error) {
        console.log("error",error);
        fs.unlinkSync(localFilePath)  //remove the temporarly saved file as it is failed
    }
}

const uploadVideoFile = async (localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRETE
    })

    // Uploading image from server to cloudinary
    try {
        if (!localFilePath) return null;

        let uploadFile = await cloudinary.uploader.upload(localFilePath,{resource_type:'video'});
        console.log(uploadFile.secure_url);
        fs.unlinkSync(localFilePath)
        return uploadFile;

    } catch (error) {
        console.log("error",error);
        fs.unlinkSync(localFilePath)  //remove the temporarly saved file as it is failed
    }
}

export {uploadResult,uploadVideoFile};
