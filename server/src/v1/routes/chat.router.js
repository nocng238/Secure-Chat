const express = require("express");
const router = express.Router();
const {
  getChat,
  getChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addUserToGroup,
} = require("../controllers/chat.controller");
const authenticateUser = require("../middlewares/auth.middleware");

router.post("/api/v1/chat", authenticateUser, getChat);
router.get("/api/v1/chat", authenticateUser, getChats);
router.post("/api/v1/chat/createGroup", authenticateUser, createGroup);
router.patch("/api/v1/chat/renameGroup", authenticateUser, renameGroup);
router.patch("/api/v1/chat/removeFromGroup", authenticateUser, removeFromGroup);
router.patch("/api/v1/chat/addUserToGroup", authenticateUser, addUserToGroup);

module.exports = router;
