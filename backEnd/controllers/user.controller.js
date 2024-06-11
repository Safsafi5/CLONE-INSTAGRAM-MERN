import User from "../models/user.model.js";
import { validatePassword } from "../utils/validation.util.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user || !user.isActivated)
      return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Eror in signUp contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
};


export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Eror in getAllUser contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
}
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    const user = await User.findById(userId).populate({
      path: 'followers',
      select: 'username profileImg email'
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    console.log("Eror in getFollowers contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    const user = await User.findById(userId).populate({
      path: 'following',
      select: 'username profileImg email'
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.following);
  } catch (error) {
    console.log("Eror in getFollowers contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
};

export const editPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    
    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ msg: "Please provide new password and confirm password" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: "Password does not match" });
    }

    if (!validatePassword(newPassword))
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: passwordHash,
      },
      { new: true } // Return the updated document
    );
    res.json({ msg: "Password Success" });
  } catch (error) {
    console.log("Eror in editPassword contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
}; 

export const editProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    let user = await User.findById(userId);
    const existengUsername = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (existengUsername)
      return res.status(400).json({ msg: "This Username is already in use" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;

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
    await user.save();
    user.password = null;

    res.status(200).json(user);
  } catch (error) {}
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const userFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      { $sample: { size: 10 } },
    ]);
    console.log(users);
    // if (!users.isActivated) {
    //   return res.status(400).json({ error: "user not activated" });
    // }

    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );

    const suggestedUser = filteredUsers.slice(0, 5);
    suggestedUser.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUser);
  } catch (error) {
    console.log("Eror in getSuggestedUser contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userTomodify = await User.findById(id);
    console.log("ini adalah usert ", userTomodify);
    const currentUser = await User.findById(req.user._id);
    console.log(currentUser);

    if (!userTomodify || !currentUser) {
      return res.status(404).json({ error: "user not Found" });
    }


    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "you can't follow/unfollow yourself" });
    }
    

   
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      res.status(200).json({ message: "user Unfollowed succesfully" });
    } else {
      //   follow the User
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
     
      res.status(200).json({ message: "user followed succesfully" });
    }
  } catch (error) {
    console.log("Eror in followUnfollowUser contrroller ", error.message);
    res.status(500).json({ error: "Internal  Serrver Eror" });
  }
};
