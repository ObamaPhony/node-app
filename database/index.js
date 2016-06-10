var mongodb = require("mongodb");
var DEFAULT_TABLE = require("../package.json").name;
var DEFAULT_URI = "mongodb://localhost/" + DEFAULT_TABLE;

module.exports = function (next) {
    if (process.env.MONGO_PORT_27017_TCP) {
      process.env.MONGO_URI = process.env.MONGO_PORT_27017_TCP
        .replace(/^tcp:/, "mongodb:")
        .replace(/$/, "/" + DEFAULT_TABLE);
    }

    mongodb.MongoClient.connect(process.env.MONGO_URI || DEFAULT_URI, function (err, db) {
        if (err) {
            throw err;
        }

        module.exports = db;
        next(db);
    });
};
