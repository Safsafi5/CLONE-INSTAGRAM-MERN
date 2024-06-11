import express from "express";
import { protecRoute } from "../middleware/protecRoute.middleware.js";
import { editPassword, editProfile, followUnfollowUser, getAllUser, getFollowers, getFollowing, getSuggestedUser, getUserProfile } from "../controllers/user.controller.js";

const routerUser = express.Router();

routerUser.get("/profile/:username", protecRoute, getUserProfile);
routerUser.get("/suggested", protecRoute, getSuggestedUser);
routerUser.get("/follower/:userId", protecRoute, getFollowers);
routerUser.get("/following/:userId", protecRoute, getFollowing);
routerUser.get("/allUser", getAllUser);


routerUser.post("/followUnfollow/:id", protecRoute, followUnfollowUser);



routerUser.patch("/editPassword", protecRoute, editPassword);
routerUser.patch("/editProfile", protecRoute, editProfile);

export default routerUser;
