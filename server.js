//Library imports
const express = require("express");
const app = express();

//Routes imports
const authRoute = require("./routes/authRoute");
const contentRoute = require("./routes/contentRoute");

//Configs
require("dotenv").config();
app.use(express.json());

//Routes
app.use("/api/v1/", authRoute);
app.use("/api/v1/", contentRoute);

app.listen(5000);
