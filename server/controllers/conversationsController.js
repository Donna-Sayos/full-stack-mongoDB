const Conversation = require("../models/Conversation");

const newConvo = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
    notificationCount: req.body.notificationCount,
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
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }, // $in is a MongoDB operator that selects the documents where the value of a field equals any value in the specified array.
    });

    const notificationCount = conversation.notificationCount;
    
    const response = { conversation, notificationCount };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTwoConvos = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] }, // $all is a MongoDB operator that selects the documents where the value of a field equals all the values specified in the array.
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  newConvo,
  getConvo,
  getTwoConvos,
};
