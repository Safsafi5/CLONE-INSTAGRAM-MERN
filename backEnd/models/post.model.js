import mongoose from "mongoose";

const subCommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likesSubcomment: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    subComments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubComment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likescomment: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    subComments: [subCommentSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    saved: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    hashtags: [
      {
        type: String,
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
