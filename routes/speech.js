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
            error(err, response);
            return;
        }

        if (doc == null) {
            status(response, 404);
            return;
        }

        response.render("speech", {
            paragraphs: doc.paragraphs
        });
    });
};
