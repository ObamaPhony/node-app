var util = require("../util");
var db = require("../database");
var mongo = require("mongodb");

var status = util.status;
var error = util.error;

module.exports = function (request, response) {
    var id = request.params.id;

    if (!mongo.ObjectId.isValid(id)) {
        status(response, 404);
        return;
    }

    db.collection("speeches").findOne({
        _id: mongo.ObjectId(id),
    }, function (err, doc) {
        if (err) {
            response.status(500);
            response.render("error");
            return;
        }

        if (doc == null) {
            response.status(404);
            response.render("error");
            return;
        }

        response.render("speech", {
            speaker: doc.speaker,
            paragraphs: doc.paragraphs
        });
    });
};
