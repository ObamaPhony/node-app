var router = require("express").Router();
module.exports = router;

router.use("/sources", require("./sources"));
router.use("/generate", require("./generate"));
