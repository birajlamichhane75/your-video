import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changePassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, EditVideoDetails, getAllVideos, uploadVideos } from "../controllers/video.controller.js";
import { getLikedVideos, toggleLike } from "../controllers/like.controller.js";
import { commentOnVideo, getComment } from "../controllers/comment.controller.js";
import { addToPlaylist, createPlaylist, getPlaylist, removeFromPlaylist } from "../controllers/playlist.controller.js";
import { uploadTweet, viewTweet } from "../controllers/tweet.controller.js";

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

router.route('/change-password').patch(verifyJWT,changePassword);
router.route('/get-current-user').get(verifyJWT,getCurrentUser);
router.route('/update-details').patch(verifyJWT,updateDetails);
router.route('/update-avatar').patch(verifyJWT,upload.single("avatar"),updateAvatar);
router.route('/update-coverImage').patch(verifyJWT,upload.single("coverImage"),updateCoverImage);
router.route('/get-user-profile/:username').get(verifyJWT,getUserChannelProfile);
router.route("/watch-history").get(verifyJWT,getWatchHistory)
router.route("/upload-video").post(verifyJWT,upload.single("video"),uploadVideos);
router.route("/get-videos").get(getAllVideos);
router.route("/delete-video/:videoID").delete(verifyJWT,deleteVideo);
router.route("/edit-video/:videoID").patch(verifyJWT,EditVideoDetails);
router.route("/like/:videoID").post(verifyJWT,toggleLike);
router.route("/get-liked-video").get(verifyJWT,getLikedVideos);  //bugs
router.route("/get-comment/:videoID").get(verifyJWT,getComment);
router.route("/post-comment/:videoID").post(verifyJWT,commentOnVideo);
router.route("/create-playlist").post(verifyJWT,createPlaylist);
router.route("/addto-playlist/:playlistID/:videoID").post(verifyJWT,addToPlaylist);
router.route("/get-playlist/:playlistID").get(verifyJWT,getPlaylist);
router.route("/remove-playlist/:playlistID/:videoID").patch(verifyJWT,removeFromPlaylist);
router.route("/tweet").post(verifyJWT,uploadTweet);
router.route("/get-tweet").get(verifyJWT,viewTweet);
 


export default router