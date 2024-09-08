import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changePassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1,
        }
    ]),
    registerUser)

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT,logOutUser);

router.route('/refresh-accesstoken').post(verifyJWT,refreshAccessToken);

router.route('/changePassword').patch(verifyJWT,changePassword);
router.route('/get-current-user').get(verifyJWT,getCurrentUser);
router.route('/updateDetails').patch(verifyJWT,updateDetails);
router.route('/update-avatar').patch(verifyJWT,upload.single("avatar"),updateAvatar);
router.route('update-coverImage').patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
router.route('/get-user-profile/:username').get(verifyJWT,getUserChannelProfile);
router.route("/watch-history").get(verifyJWT,getWatchHistory)


export default router