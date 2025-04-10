const { getFriendModel, getRequestModel, getChatModel } = require('../utils/dynamicModels');
const User = require('../models/user'); // existing user model

// Example method: get friend list
exports.getFriends = async (req, res) => {
  try {
    const username = req.user.username; // from authMiddleware
    const FriendsModel = getFriendModel(username);
    let friendDoc = await FriendsModel.findOne({});
    if (!friendDoc) {
      friendDoc = await FriendsModel.create({ pals: [] });
    }
    res.json(friendDoc.pals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example method: get friend requests
exports.getFriendRequests = async (req, res) => {
  try {
    const username = req.user.username;
    const RequestModel = getRequestModel(username);
    let requestDoc = await RequestModel.findOne({});
    if (!requestDoc) {
      requestDoc = await RequestModel.create({ incomingRequests: [] });
    }
    res.json(requestDoc.incomingRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example method: send friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const requester = req.user.username;
    const { targetUsername } = req.body;

    // Check if user exists
    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const RequestModel = getRequestModel(targetUsername);
    let requestDoc = await RequestModel.findOne({});
    if (!requestDoc) {
      requestDoc = await RequestModel.create({ incomingRequests: [] });
    }
    if (!requestDoc.incomingRequests.includes(requester)) {
      requestDoc.incomingRequests.push(requester);
      await requestDoc.save();
    }
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example method: accept friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const username = req.user.username; // the user accepting
    const { fromUsername } = req.body;  // the user who requested

    // Remove from user’s Request list
    const RequestModel = getRequestModel(username);
    const requestDoc = await RequestModel.findOne({});
    if (!requestDoc) return res.status(400).json({ error: 'No requests found' });
    requestDoc.incomingRequests = requestDoc.incomingRequests.filter(u => u !== fromUsername);
    await requestDoc.save();

    // Add fromUsername to user’s friend list
    const FriendsModelUser = getFriendModel(username);
    let friendDocUser = await FriendsModelUser.findOne({});
    if (!friendDocUser) {
      friendDocUser = await FriendsModelUser.create({ pals: [] });
    }
    if (!friendDocUser.pals.includes(fromUsername)) {
      friendDocUser.pals.push(fromUsername);
      await friendDocUser.save();
    }

    // Add user to fromUsername’s friend list
    const FriendsModelOther = getFriendModel(fromUsername);
    let friendDocOther = await FriendsModelOther.findOne({});
    if (!friendDocOther) {
      friendDocOther = await FriendsModelOther.create({ pals: [] });
    }
    if (!friendDocOther.pals.includes(username)) {
      friendDocOther.pals.push(username);
      await friendDocOther.save();
    }

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example method: refuse friend request
exports.refuseFriendRequest = async (req, res) => {
  try {
    const username = req.user.username;
    const { fromUsername } = req.body;
    const RequestModel = getRequestModel(username);
    const requestDoc = await RequestModel.findOne({});
    if (requestDoc) {
      requestDoc.incomingRequests = requestDoc.incomingRequests.filter(u => u !== fromUsername);
      await requestDoc.save();
    }
    res.json({ message: 'Friend request refused' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example method: search for users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const results = await User.find({
      username: { $regex: query, $options: 'i' }
    }).select('username');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example method: get chat data with a friend
exports.getChatWithFriend = async (req, res) => {
  try {
    const username = req.user.username;
    const { friendUsername } = req.params;
    const ChatModel = getChatModel(username);
    const chats = await ChatModel.find({ friendUsername }).sort({ day: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example method: send a message
exports.sendMessage = async (req, res) => {
  try {
    const username = req.user.username;
    const { friendUsername, content, day, time } = req.body;

    // Insert into the sender’s chat collection
    const ChatModel = getChatModel(username);
    let doc = await ChatModel.findOne({ friendUsername, day });
    if (!doc) {
      doc = await ChatModel.create({ friendUsername, day, messages: [] });
    }
    doc.messages.push({ from: username, time, content });
    await doc.save();

    // Mirror message in the friend’s chat collection
    const ChatModelFriend = getChatModel(friendUsername);
    let docFriend = await ChatModelFriend.findOne({ friendUsername: username, day });
    if (!docFriend) {
      docFriend = await ChatModelFriend.create({ friendUsername: username, day, messages: [] });
    }
    docFriend.messages.push({ from: username, time, content });
    await docFriend.save();

    res.json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
