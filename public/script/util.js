function API(name, args, callback) {
    if (typeof args === "function") {
        callback = args;
        args = [];
    }

    $.getJSON("/api/" + name + "/" + args.join("/"), callback);
}
