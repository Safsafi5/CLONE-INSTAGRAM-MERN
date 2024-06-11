import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";
import sendLikeNotificationEmail from "../utils/service/post/likeNotifPost.js";
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Please provide text or image" });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (post.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikeUnlikePost = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPost = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(likedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getsavedUserPost = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const savedPost = await Post.find({ _id: { $in: user.savedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    res.status(200).json(savedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const following = user.following;
    const feedPost = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editPost = async (req, res) => {
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

export const likedUnlikedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log( userId);
    const { id: postId } = req.params;
    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // Unlike
      await Post.updateOne(
        { _id: postId },
        {
          $pull: { likes: userId },
        }
      );
      await User.updateOne(
        { _id: userId },
        {
          $pull: { likedPosts: postId },
        }
      );
      const updateLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updateLikes);
    } else {
      // like
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();


      // send notif email 
      const like = await User.findById(userId);
      await sendLikeNotificationEmail(post.user.email, post.text, like.username);
      const updalikedPost = post.likes;

      res.status(200).json(updalikedPost);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const savedUnsavedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userSavedPost = post.saved.includes(userId);
    if (userSavedPost) {
      // Unsave
      await Post.updateOne({ _id: post }, { $pull: { saved: userId } });
      await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } });

      const updateUnsaved = post.saved.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updateUnsaved);
    } else {
      // Save
      post.saved.push(userId);
      await User.updateOne({ _id: userId }, { $push: { savedPosts: postId } });
      await post.save();
      const updateSaved = post.saved;
      res.status(200).json(updateSaved);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id; //menggunakan req.user._id  untuk mendapatkan user login

    if (!text) {
      return res.status(400).json({ error: "Please provide text" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: userId,
      text,
      likescomment: [],
      subComments: [],
    };

    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const subComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId, commentId, subCommentId } = req.params;

    const userId = req.user._id; //menggunakan req.user._id  untuk mendapatkan user login

    if (!text) {
      return res.status(400).json({ error: "Please provide text" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    let parentSubComment;
    if (subCommentId) {
      parentSubComment = findSubComment(comment.subComments, subCommentId);
      if (!parentSubComment)
        return res.status(404).json({ error: "Subcomment not found" });
    }

    const newSubComment = {
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      text,
      likesSubcomment: [],
      subComments: [],
    };

    if (parentSubComment) {
      parentSubComment.subComments.push(newSubComment);
    } else {
      comment.subComments.push(newSubComment);
    }
    await post.save();

    await post.populate({
      path: "comments.subComments.user",
      model: "User",
    }).execPopulate();


    // Temukan subkomentar baru dengan ID yang sesuai
    const fullSubComment = post.comments.id(commentId).subComments.id(newSubComment._id);
    return res.status(201).json(fullSubComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const findSubComment = (subComments, subCommentId) => {
  for (const subComment of subComments) {
    if (subComment._id.equals(subCommentId)) {
      return subComment;
    }
    const nestedSubComment = findSubComment(
      subComment.subComments,
      subCommentId
    );
    if (nestedSubComment) {
      return nestedSubComment;
    }
  }
  return null;
};

export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isLiked = comment.likescomment.includes(userId);
    if (isLiked) {
      comment.likescomment.pull(userId);
    } else {
      comment.likescomment.push(userId);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
