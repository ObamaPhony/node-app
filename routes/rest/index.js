var router = require("express").Router();
module.exports = router;

router.get("/", function (request, response) {
    response.json({
        test: {
            data: "TBA"
        }
    });
});
