var router = require("express").Router();
var db = require("../../database");
var mongo = require("mongodb");
module.exports = router;

function status(response, code) {
    response.status(code);
    response.json({
        err: code
    });
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

    db.collection("sources").find().map(function (doc) {
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
     *    speeches: [
     *       "content of speech",
     *    ]
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

        response.json({
            id: doc._id,
            name: doc.name,
            speeches: doc.speeches,
            err: null
        });
    });
});
