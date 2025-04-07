const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

// Just to verify token works
router.get("/", auth, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

module.exports = router;
