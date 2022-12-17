const express = require("express");
const router = express.Router();
const rateLimiter = require("express-rate-limit");
const {
  register,
  login,
  searchUser,
} = require("../controllers/auth.controller");
const authenticateUser = require("../middlewares/auth.middleware");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.post("/api/v1/auth/register", apiLimiter, register);
router.post("/api/v1/auth/login", apiLimiter, login);
router.get("/api/v1/auth/users", authenticateUser, searchUser);

module.exports = router;
