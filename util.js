var spawn = require("child_process").spawn;
var winston = require("winston");

exports.logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './app.log',
            handleExceptions: true,
            maxSize: 5242880,
            json: true,
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

exports.log = {
    write: function (message, encoding) {
        exports.logger.info(message)
    }
};

exports.status = function (response, code) {
    response.status(code);
    response.json({
        err: code
    });
};

exports.error = function (response, err) {
    this.status(response, 500);
    this.logger.error(err);
};

exports.spawn = function (bin, stdin, next, args) {
    var proc = spawn(bin, args);
    var buffer = "";

    proc.stdout.on("data", function (data) {
        buffer += data;
    });

    proc.stdout.on("end", function () {
        var json = JSON.parse(buffer);
        next(json);
    });

    proc.stdin.write(stdin);
    proc.stdin.end();
};
