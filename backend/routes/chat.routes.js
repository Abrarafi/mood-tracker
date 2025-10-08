const express = require("express");
const {
  createChatSession,
  getChatSession,
  sendMessage,
  getChatHistory,
  getAllChatSessions,
  deleteChatSession,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new chat session
router.post("/sessions", createChatSession);

// Get all chat sessions for user
router.get("/sessions", getAllChatSessions);

// Get a specific chat session
router.get("/sessions/:sessionId", getChatSession);

// Send a message in a chat session
router.post("/sessions/:sessionId/messages", sendMessage);

// Get chat history for a session
router.get("/sessions/:sessionId/history", getChatHistory);

// Delete a chat session
router.delete("/sessions/:sessionId", deleteChatSession);

module.exports = router;

// Postman script example (for token handling):
// let response = pm.response.json();
// pm.globals.set("access_token", response.access_token);
