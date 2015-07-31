var router = require("express").Router();
var util = require("../../util");
var db = require("../../database");
var mongo = require("mongodb");
module.exports = router;

var status = util.status;
var error = util.error;
var analyse = require("./sources").analyse;

/* GET /:id/:topic/:topic/:count */
/* hacky regexp because Express only decodes '%20' (space) after matching */
router.get(/^\/(.+?)\/(([A-Za-z0-9 \/]|%20)+\/[0-9]+)$/, function (request, response) {
    /*
     * should return 'count' "constructs" (TODO: paragraphs? sentences?) generated
     * about 'topic', 'topic', etc. for speech id 'id'
     *
     * output:
     * {
     *     id: 'identifier',
     *     speaker: 'source name',
     *     constructs: {
     *         'topic': ['sentence', ],
     *     }
     * }
     */

    var id = request.params[0], args = request.params[1].split("/");

    if (!mongo.ObjectId.isValid(id)) {
        status(response, 404);
        return;
    }

    db.collection("sources").findOne({
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

        analyse(doc, function (doc) {
            util.spawn("./bin/generate", JSON.stringify(doc.analysis), function (json) {
                db.collection("generated").ensureIndex({
                    expires: 1
                }, {
                    expireAfterSeconds: 2 * 60 * 60
                }, function (err) {
                    if (err) {
                        error(err, response);
                        return;
                    }

                    db.collection("generated").insert({
                        createdAt: new Date(),
                        speaker: doc.name,
                        constructs: json /* TODO: paragraphs? sentences */
                    }, function (err, result) {
                        if (err) {
                            error(err, response);
                            return;
                        }

                        var doc = result.ops[0]
                        response.json({
                            id: doc._id,
                            constructs: doc.constructs
                        });
                    });
                });
            }, args);
        });
    });
});

router.post("/", function (request, response) {
    var id = request.body.id;
    
    if (!mongo.ObjectId.isValid(id)) {
        status(response, 404);
        return;
    }

    db.collection("generated").findOne({
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

        var paragraphs = [];
        for (var topic in doc.constructs) {
            var indexes = request.body.constructs[topic];
            var paragraph = indexes.map(function (i) {
                return doc.constructs[topic][i];
            }).join("");
            paragraphs.push(paragraph);
        }

        db.collection("speeches").insert({
            speaker: doc.speaker,
            paragraphs: paragraphs
        }, function (err, result) {
            if (err) {
                error(err, response);
                return;
            }

            var doc = result.ops[0]
            response.json({
                id: doc._id
            });
        });
    });
});
