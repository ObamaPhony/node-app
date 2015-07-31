String.prototype.trim = String.prototype.trim || function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
};

Array.isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) == "[object Array]";
}

function API(name, args, callback) {
    if (typeof args === "function") {
        callback = args;
        args = [];
    }

    if (Array.isArray && Array.isArray(args)) {
        $.getJSON("/api/" + name + "/" + args.join("/"), callback);
    } else {
        $.ajax({
            type: "POST",
            url: "/api/" + name,
            contentType: "application/json",
            data: JSON.stringify(args),
            success: callback
        });
    }
}
