const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  //   console.log(refreshToken);
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("denied");

  try {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
      if (err) return res.sendStatus(401);

      const user = {
        useremail: data.user.user_email,
        username: data.user.username,
      };

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(400).send({ ErrMessage: "Invalid" });
  }
};
