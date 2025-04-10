const express = require('express');
const router = express.Router();
const penpalController = require('../controllers/penpalController');
const authMiddleware = require('../middleware/auth'); // reuse your existing middleware

router.use(authMiddleware);

// Friends
router.get('/friends', penpalController.getFriends);

// Friend Requests
router.get('/requests', penpalController.getFriendRequests);
router.post('/requests/send', penpalController.sendFriendRequest);
router.post('/requests/accept', penpalController.acceptFriendRequest);
router.post('/requests/refuse', penpalController.refuseFriendRequest);

// Search
router.get('/search', penpalController.searchUsers);

// Chat
router.get('/chats/:friendUsername', penpalController.getChatWithFriend);
router.post('/chats/send', penpalController.sendMessage);

module.exports = router;
