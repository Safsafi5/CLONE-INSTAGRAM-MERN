
import express from "express";
import multer1 from "../utils/multer.js";
import { uploadImage } from "../controllers/uploadImage.js";

const uploadRouter = express.Router();

uploadRouter.post("/create", multer1.array("images"), uploadImage)

export default uploadRouter
