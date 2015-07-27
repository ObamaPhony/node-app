var express = require("express");
var path = require("path");

var app = express();

/* templating */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* SASS */
var sass = require("node-sass-middleware");
app.use(sass({
    src: __dirname,
    dest: path.join(__dirname, "public"),
    outputStyle: "compressed",
    prefix: "css"
}));

/* static files */
app.use(express.static(path.join(__dirname, "public")));

/* modules */

/* URL routes */
var routes = require("./routes");

/* start server */
app.listen(process.env.PORT || 8080);
