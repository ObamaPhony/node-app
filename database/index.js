var mongodb = require("mongodb");
module.exports = function (next) {
    mongodb.MongoClient.connect("mongodb://localhost:27017/obama", function (err, db) {
        if (err) {
            throw err;
        }

        module.exports = db;
        next(db);
    });
};
