import mongoose from "mongoose";
// model asli sebelum subcoment rekursif
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
    comments: [
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
        subComments: [
          {
            text: {
              type: String,
              required: true,
            },
            user: {
              type: mongoose.Types.ObjectId,
              ref: "SubComment",
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
          { timestamps: true },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
