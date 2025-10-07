const express = require("express");
const {
  createChatSession,
  getChatSession,
  sendMessage,
  getChatHistory,
} = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new chat session
router.post("/sessions", createChatSession);

// Get a specific chat session
router.get("/sessions/:sessionId", getChatSession);

// Send a message in a chat session
router.post("/sessions/:sessionId/messages", sendMessage);

// Get chat history for a session
router.get("/sessions/:sessionId/history", getChatHistory);

module.exports = router;

// Postman script example (for token handling):
// let response = pm.response.json();
// pm.globals.set("access_token", response.access_token);
