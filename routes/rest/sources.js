var router = require("express").Router();
var util = require("../../util");
var db = require("../../database");
var mongo = require("mongodb");
module.exports = router;

var status = util.status;

function analyse(doc, next) {
    if (doc.analysis) {
        next(doc);
    } else {
        util.spawn("./bin/analyse", doc.speeches.join("\n"), function (json) {
            doc.analysis = json;
            db.collection("sources").update({
                _id: mongo.ObjectId(doc._id)
            }, { $set: {
                analysis: doc.analysis
            } });
            next(doc);
        });
    }
}

router.get("/", function (request, response) {
    /*
     * should list all preset sources 
     *
     * output:
     * [
     *     {
     *         id: "identifier",
     *         name: "the name (e.g. Barack Obama)"
     *     },
     * ]
     */

    db.collection("sources").find({
        preset: true
    }).map(function (doc) {
        return {
            id: doc._id,
            name: doc.name
        };
    }).toArray(function (err, sources) {
        if (err) {
            status(response, 500);
            return;
        }

        response.json(sources);
    });
});

router.get("/:id", function (request, response) {
    /*
     * should return the source named by id
     *
     * output:
     * {
     *    err: status || null,
     *    id: "identifier", // couldn't hurt, could it?
     *    name: "the name (e.g. Barack Obama)",
     *    analysis: [ analysis, ]
     * }
     */

    if (!mongo.ObjectId.isValid(request.params.id)) {
        status(response, 404);
        return;
    }

    db.collection("sources").findOne({
        _id: mongo.ObjectId(request.params.id),
    }, function (err, doc) {
        if (err) {
            status(response, 500);
            return;
        }

        if (doc == null) {
            status(response, 404);
            return;
        }

        analyse(doc, function () {
            response.json({
                id: doc._id,
                name: doc.name,
                analysis: doc.analysis,
                err: null
            });
        });
    });
});

/* GET /:id/:topic/:topic/:count */
router.get(/^\/(.*?)\/([A-Za-z]+\/[0-9]+)$/, function (request, response) {
    /*
     * should return 'count' "things" (TODO: paragraphs? sentences?) generated about
     * 'topic', 'topic', etc. for speech id 'id'
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
            status(response, 500);
            return;
        }

        if (doc == null) {
            status(response, 404);
            return;
        }

        analyse(doc, function (doc) {
            util.spawn("./bin/generate", JSON.stringify(doc.analysis), function (json) {
                response.json(json);
            }, args);
        });
    });
});
