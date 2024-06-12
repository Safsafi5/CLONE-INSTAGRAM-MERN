import express from "express"
import { protecRoute } from "../middleware/protecRoute.middleware.js"
import { authAdmin } from "../middleware/authAdmin.middleware.js"
import { editPostUser, getAllUsers, updateUser } from "../controllers/admin.controller.js"


const adminRouter =express.Router()

adminRouter.get("/getAllUsers", protecRoute, authAdmin, getAllUsers)


adminRouter.patch("/updateUser/:userId", protecRoute, authAdmin, updateUser)
adminRouter.patch("/updatePostUser/:postId", protecRoute, authAdmin,editPostUser )

export default adminRouter