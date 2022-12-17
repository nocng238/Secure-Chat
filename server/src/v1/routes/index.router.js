const express = require("express");
const router = express.Router();

router.get("/api/v1", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "api ok",
  });
});

module.exports = router;
