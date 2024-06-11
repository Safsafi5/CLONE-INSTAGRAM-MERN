import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res, next) => {
  try {
    const images = req.files;
    console.log(images);
    const imageUrls = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
        imageUrls.push(result.secure_url)
    }
        
      req.images = imageUrls
      console.log(req.images)
      next()
  } catch (error) {
    console.log(error);
  }
};
