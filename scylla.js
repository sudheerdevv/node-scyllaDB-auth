const cassandra = require("cassandra-driver");

const client = new cassandra.Client({
  contactPoints: ["localhost"],
  localDataCenter: "datacenter1",
  keyspace: "catalog",
});

module.exports = client;
