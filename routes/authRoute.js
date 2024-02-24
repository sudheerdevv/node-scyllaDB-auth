//Library imports
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const scyllaclient = require("../scylla");
const { v4 } = require("uuid");
const { validateLogin, validateRegister } = require("../validation");

//Register user route
router.post("/register", async (req, res) => {
  scyllaclient.connect();

  //Validate the fields
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Hashing the password
  const hashedPassword = await bcrypt.hash(
    req.body.userpassword,
    await bcrypt.genSalt(10)
  );

  const userExistQuery = `${process.env.USEREXISTSQUERY}='${req.body.useremail}'`;
  scyllaclient.execute(userExistQuery, (error, result) => {
    if (error) return res.sendStatus(500);
    if (result.rows.length !== 0) {
      res.status(403).send("Email Already exists");
    } else {
      const id = v4().replace(/[^a-zA-Z ]/g, "");
      const pushUserQuery = process.env.PUSHUSERQUERY;
      const params = [
        id,
        req.body.username,
        req.body.useremail,
        hashedPassword,
      ];

      scyllaclient.execute(pushUserQuery, params, (err, result) => {
        res.status(201).send(result);
      });
    }
  });
});

//Login user route
router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userExistQuery = `${process.env.USEREXISTSQUERY}='${req.body.useremail}'`;
  scyllaclient.execute(userExistQuery, async (error, result) => {
    if (error) return res.sendStatus(500);
    if (result.rows.length == 0) {
      res.status(403).send("Email or password is wrong");
    } else {
      const validPassword = await bcrypt.compare(
        req.body.userpassword,
        result.rows[0].user_password
      );

      if (!validPassword) {
        res.status(400).send("invalid password");
      } else {
        const token = generateAccessToken({ user: result.rows[0].user_email });

        const refreshToken = jwt.sign(
          { user: result.rows[0] },
          process.env.REFRESHTOKEN_SECRET
        );

        res.cookie("refreshToken", refreshToken).send({ token: token });
      }
    }
  });
});

//Refresh access token
router.post("/refresh-token", (req, res) => {
  jwt.verify(req.body.token, process.env.REFRESHTOKEN_SECRET, (err, data) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ user: data.user.user_email });
    res.json({ accessToken: accessToken });
  });
});

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: "5m" });
};

module.exports = router;
