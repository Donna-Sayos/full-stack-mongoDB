const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    // members: {
    //   type: Array,
    // },
    members: [{ // FIXME: testing feature
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      isReading: {
        type: Boolean,
        default: false,
      },
    }],
    notificationCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
