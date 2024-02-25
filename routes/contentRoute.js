//Importing Libraries
const verifyToken = require("../verifyToken");
const axios = require("axios");
const { createClient } = require("redis");

const router = require("express").Router();

//Connecting to Redis
const redisClient = createClient();
redisClient.connect();

//Get content
router.get("/content", verifyToken, async (req, res) => {
  console.log("Started");

  redisClient
    .get("content")
    .then(async (content) => {
      //Checking if there is content data in the Redis db
      if (content != null) {
        //If content exists return the response
        return res.send(JSON.parse(content));
      } else {
        //If content does not exists get the data and push to Redis DB
        await axios
          .all([
            axios.get("https://isro.vercel.app/api/spacecrafts"),
            axios.get("https://isro.vercel.app/api/launchers"),
            axios.get("https://isro.vercel.app/api/customer_satellites"),
            axios.get("https://isro.vercel.app/api/centres"),
            axios.get("https://api.nobelprize.org/2.1/nobelPrizes"),
          ])
          .then(
            axios.spread(
              (
                spacecrafts,
                launchers,
                customer_satellites,
                centers,
                nobelprizes
              ) => {
                let fullContent = [];
                fullContent.push(
                  spacecrafts.data,
                  launchers.data,
                  customer_satellites.data,
                  centers.data,
                  nobelprizes.data
                );
                redisClient.SETEX(
                  "content",
                  "3600",
                  JSON.stringify(fullContent)
                );
                res.send(fullContent);
              }
            )
          );
      }
    })
    .catch((err) => res.send(err));
});

module.exports = router;
