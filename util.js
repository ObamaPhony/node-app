var spawn = require("child_process").spawn;

exports.status = function (response, code) {
    response.status(code);
    response.json({
        err: code
    });
};

exports.spawn = function (bin, stdin, next) {
    var proc = spawn(bin);
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
