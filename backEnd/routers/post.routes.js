import express from "express";
import { commentPost, createPost, deletePost, editPost, getAllPosts, getFollowPost, getLikeUnlikePost, getsavedUserPost, getUserPost, likeComment, likedUnlikedPost, savedUnsavedPost, subComment } from "../controllers/post.controller.js";
import { protecRoute } from "../middleware/protecRoute.middleware.js";


const postRoutes = express.Router();
postRoutes.get("/getAllPost",protecRoute, getAllPosts)
postRoutes.get("/getFollowing", protecRoute, getFollowPost)
postRoutes.get("/user/:username", protecRoute, getUserPost)
postRoutes.get("/liked/:id", protecRoute, getLikeUnlikePost)
postRoutes.get("/save/:id", protecRoute, getsavedUserPost)


postRoutes.post("/create",protecRoute, createPost)
postRoutes.post("/like/:id",protecRoute, likedUnlikedPost)
postRoutes.post("/save/:id",protecRoute, savedUnsavedPost)
postRoutes.post("/postsId/:id",protecRoute, commentPost)

// postRoutes.post("/postsId/:postId/commentId/:commentId/subcomment", protecRoute, subComment);

postRoutes.post("/postsId/:postId/commentId/:commentId/subcomment/:subCommentId?/:subCommentId?", protecRoute, subComment);


postRoutes.post("/posts/:postId/comment/:commentId/like",protecRoute, likeComment)
postRoutes.patch("/editPost/:postId",protecRoute, editPost)
postRoutes.delete("/delete/:id",protecRoute, deletePost)

export default postRoutes