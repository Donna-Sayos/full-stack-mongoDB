const Conversation = require("../models/Conversation");

// const newConvo = async (req, res) => {
//   const newConversation = new Conversation({
//     members: [req.body.senderId, req.body.receiverId],
//     notificationCount: 0, // set initial notification count to zero
//   });

//   try {
//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
const newConvo = async (req, res) => {
  // FIXME: testing feature
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  const newConversation = new Conversation({
    members: [
      { _id: senderId, isReading: false },
      { _id: receiverId, isReading: false },
    ],
    notificationCount: 0,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getConvo = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json({
      conversations,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTwoConvos = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

const incrementNotificationCount = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    await Conversation.updateOne(
      { _id: conversationId },
      { $inc: { notificationCount: 1 } }
    );
    res
      .status(200)
      .json({ message: "Notification count updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating notification count" });
  }
};

const getNotificationCount = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const conversation = await Conversation.findById(conversationId);
    res.status(200).json({
      notificationCount: conversation.notificationCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving notification count" });
  }
};

const resetNotificationCount = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { notificationCount: 0 },
      { new: true }
    );

    res.status(200).json({
      message: "Notification count reset successfully",
      notificationCount: conversation.notificationCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error resetting notification count" });
  }
};

const markConversationAsRead = async (req, res) => {
  // FIXME: testing feature
  const conversationId = req.params.conversationId;
  const userId = req.params.userId;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Find the member with the given userId in the members array
    const member = conversation.members.find((member) =>
      member._id.equals(userId)
    );

    if (!member) {
      return res
        .status(404)
        .json({ message: "User not found in conversation" });
    }

    // Update the member's isReading status to true
    member.isReading = true;

    // Save the updated conversation
    await conversation.save();

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

const markConversationAsUnread = async (req, res) => {
  // FIXME: testing feature
  const conversationId = req.params.conversationId;
  const userId = req.params.userId;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Find the member with the given userId in the members array
    const member = conversation.members.find((member) =>
      member._id.equals(userId)
    );

    if (!member) {
      return res
        .status(404)
        .json({ message: "User not found in conversation" });
    }

    // Update the member's isReading status to false
    member.isReading = false;

    // Save the updated conversation
    await conversation.save();

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  newConvo,
  getConvo,
  getTwoConvos,
  incrementNotificationCount,
  getNotificationCount,
  resetNotificationCount,
  markConversationAsRead,
  markConversationAsUnread,
};
