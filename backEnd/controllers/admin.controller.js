import Post from "../models/post.model.js";
import User from "../models/user.model.js"


export const  getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.log("Eror in getAllUsers contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
}
export const updateUser = async (req, res) => {
    try {
        const {username, email , bio, isActivated, role,password, confirmPassword, profileImg, coverImg} = req.body

        const userId = req.params.userId

        const user = await User.findById(userId)
        if(!user) return res.status(404).json({msg: "User not found"})

      const existengUsername = await User.findOne({username})
      if(existengUsername) return res.status(400).json({msg: "This Username is already in use"})

    const existengEmail = await User.findOne({email})
    if(existengEmail) return res.status(400).json({msg: "This Email is already in use"})

        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.isActivated = isActivated || user.isActivated
        user.role = role || user.role

        if (profileImg) {
            if (user.profileImg) {
              await cloudinary.uploader.destroy(
                user.profileImg.split("/").pop().split(".")[0]
              );
            }
            const uploadedImg = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedImg.secure_url;
          }
      
          if (coverImg) {
            if (user.coverImg) {
              await cloudinary.uploader.destroy(
                user.coverImg.split("/").pop().split(".")[0]
              );
            }
            const uploadedImg = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedImg.secure_url;
          }
          await user.save()
          res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const editPostUser = async (req, res) => {

  try {
    const { text, img } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Please provide text or image" });
    }

    if (text !== undefined) post.text = text;
    if (img !== undefined) post.img = img;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
