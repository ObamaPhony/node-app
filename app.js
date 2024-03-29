var express = require("express");
var path = require("path");

var app = express();

/* logging */
app.use(require("morgan")("combined", { stream: require("./util").log }));

require("./database")(function () {
    /* templating */
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    /* SASS */

    var sassMiddleWare = require("node-sass-middleware");
    app.use(sassMiddleWare({
        src: path.join(__dirname, "css"),
        dest: path.join(__dirname, "public/css"),
        debug: true,
        outputStyle: "compressed",
        prefix: "/css"
    }));

    /* body parsing */
    var bodyParser = require("body-parser");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    /* static files */
    app.use(express.static(path.join(__dirname, "public")));

    /* URL routes */
    app.use(require("./routes"));

    /* start server */
    app.listen(process.env.PORT || 8080);
});
