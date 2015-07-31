function API(name, args, callback) {
    if (typeof args === "function") {
        callback = args;
        args = [];
    }

    if (Array.isArray(args)) {
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
