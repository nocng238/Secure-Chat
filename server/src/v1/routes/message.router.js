const express = require("express");
const router = express.Router();
const {
  allMessages,
  sendMessage,
} = require("../controllers/message.controller");
const authenticateUser = require("../middlewares/auth.middleware");

router.get("/api/v1/message/:chatId", authenticateUser, allMessages);
router.post("/api/v1/message", authenticateUser, sendMessage);

module.exports = router;
