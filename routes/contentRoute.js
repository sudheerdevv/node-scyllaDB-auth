const verifyToken = require("../verifyToken");

const router = require("express").Router();

router.get("/content", verifyToken, (req, res) => {
  res.send("hey");
});

module.exports = router;
