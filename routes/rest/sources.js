var router = require("express").Router();
var util = require("../../util");
module.exports = router;

router.get("/", function (request, response) {
    /*
     * should list all preset sources 
     *
     * output:
     * [
     *     {
     *         id: "identifier",
     *         name: "a name (e.g. Barack Obama)"
     *     },
     * ]
     */

    var sources = []
    for (var id in util.sources.map) {
        var source = util.sources.map[id];
        sources.push({
            id: id,
            name: source.name
        });
    }

    response.json(sources);
});
