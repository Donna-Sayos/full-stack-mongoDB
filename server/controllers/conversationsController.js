const Conversation = require("../models/Conversation");

const newConvo = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    notificationCount: 0, // set initial notification count to zero
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
  const currentChatId = req.params.currentChatId;
  const receiverId = req.params.receiverId;

  try {
    await Conversation.updateOne(
      { _id: currentChatId, receiverId: receiverId },
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
  const currentChatId = req.params.currentChatId;
  const receiverId = req.params.receiverId;

  try {
    const conversation = await Conversation.findOne({
      _id: currentChatId,
      receiverId: receiverId,
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json({
      notificationCount: conversation.notificationCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving notification count" });
  }
};

const resetNotificationCount = async (req, res) => {
  const currentChatId = req.params.currentChatId;
  const receiverId = req.params.receiverId;

  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: currentChatId, receiverId: receiverId },
      { notificationCount: 0 },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({
      message: "Notification count reset successfully",
      notificationCount: conversation.notificationCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error resetting notification count" });
  }
};

module.exports = {
  newConvo,
  getConvo,
  getTwoConvos,
  incrementNotificationCount,
  getNotificationCount,
  resetNotificationCount,
};
