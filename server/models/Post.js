const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

PostSchema.index({ userId: 1 });

PostSchema.statics.nextCount = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    return 1;
  }
  const lastUser = await this.findOne().sort({ userId: -1 });
  return lastUser.userId + 1;
};

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
