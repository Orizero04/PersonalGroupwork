const mongoose = require('mongoose');

/* 
  Schemas for each type of data: 
    - Friend lists
    - Requests
    - Chats (grouped by day)
*/

const friendSchema = new mongoose.Schema({
  pals: [String],  // array of usernames
});

const requestSchema = new mongoose.Schema({
  incomingRequests: [String], // array of usernames who requested
});

/*
  Example doc in `Chats-<username>`:
  {
    friendUsername: 'alice',
    day: '2025-03-27', 
    messages: [
      { from: 'john', time: '10:20', content: 'Hi Alice' },
      { from: 'alice', time: '10:22', content: 'sup' John?' },
    ]
  }
*/
const chatSchema = new mongoose.Schema({
  friendUsername: { type: String, required: true },
  day: { type: String, required: true },
  messages: [
    {
      from: String, 
      time: String,  
      content: String,
    }
  ],
});

function getFriendModel(username) {
  const modelName = `Friends-${username}`;
  return mongoose.models[modelName] || mongoose.model(modelName, friendSchema, modelName);
}

function getRequestModel(username) {
  const modelName = `Request-${username}`;
  return mongoose.models[modelName] || mongoose.model(modelName, requestSchema, modelName);
}

function getChatModel(username) {
  const modelName = `Chats-${username}`;
  return mongoose.models[modelName] || mongoose.model(modelName, chatSchema, modelName);
}

module.exports = { getFriendModel, getRequestModel, getChatModel };
