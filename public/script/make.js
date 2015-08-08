var NUMBER_CHOICES = 3;

$(function () {
    $("#loading").hide();

// Google Trends {{{
var TRENDS = 5;
$.ajax({
    url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.google.com/trends/hottrends/atom/feed?pn=p1&num=" + TRENDS,
    jsonp: "callback",
    dataType: "jsonp",
    success: function (data) {
        var feed = data.responseData.feed.entries;
        for (var i = 0; i < feed.length; i++) {
            var trend = feed[i].title;
            $("<a/>").text(trend).addClass("button").click(function () {
                $(this).hide();
                var e = $.Event("keyup");
                e.keyCode = 13;
                $("#userInput").val($(this).text()).trigger(e);
            }).prependTo("#trends");
        }
    }
});
// }}}

// input box management {{{
var punctuation = /[^a-zA-Z0-9 ]+/;
function fix(that) {
    $(that).removeClass("error");
    var value = $(that).val();
    value = value.replace(punctuation, "").replace(/\s/, " ").replace(/ +/, " ");
    if ($(that).val() != value) {
        $(that).val(value);
    }
}

$("#userInput").on("keyup change", function (e) {
    fix(this);

    // enter key */
    if (e.keyCode == 13 && $(this).val().trim()) {
        $("<input type='text' />").val($(this).val()).appendTo("#topics-content").on("keyup change", function (e) {
            fix(this);
            if (!$(this).val().trim()) {
                $(this).find("+ br").remove();
                $(this).remove();
                $("#userInput").focus();
            }
        }).before("<br />");
        $(this).val("");
        $("#topics").animate({ scrollTop: $("#topics")[0].scrollHeight });
    }
});
// }}}

// resizing {{{
$(window).on("resize orientationChange keyup mouseup", function () {
    if ($("#main").length) {
        $("#topics").css("height", $("#main").offset().top - $("#topics").offset().top - parseInt($("#main").css("margin-top")));
    }
});
$(window).resize();
// }}}

// uploading {{{
$("#uploader").change(function () {
    $("#upload-submit").show();
});

$("#upload").click(function () {
    $("#uploader").click();
});
// }}}

// user interaction {{{
$("#submit").click(function () {
    var topics = [];
    $("#topics-content input, #userInput").each(function () {
        $(this).val($(this).val().trim());
        fix(this);
        if ($(this).val()) {
            topics.push($(this).val());
        }
    });

    if (!topics.length) {
        $("#userInput").addClass("error");
        return false;
    }
        
    $("html .topics").hide();
    $("#loading").show();
    $("#main").removeAttr("id").addClass("middle");

    API("sources", function (data) {
        for (var i = 0; i < data.length; i++) {
            (function (speaker) {
                $("<a/>").addClass("button").text(speaker.name).appendTo("#speakers .list").after("<br />")
                    .click(function () {
                        $("#speakers").hide();
                        $("#generate").parent().removeClass("middle");
                        $("#loading").show();
                        var args = [speaker.id].concat(topics).concat([NUMBER_CHOICES]);
                        API("generate", args, function (data) {
                            var constructs = data.constructs;
                            var list = $("#choices .list");
                            for (var topic in constructs) {
                                (function (choices) {
                                    for (var i = 0; i < choices.length; i++) {
                                        (function (choice) {
                                            var first = choice.split(".")[0];
                                            var name = "choice!" + escape(topic) + "!" + i;
                                            var radio = $("<input type='radio'/>").attr("id", name).attr("name", topic);
                                            var label = $("<label/>").attr("for", name).text(first).appendTo(list)
                                                .before(radio).after("<br />");
                                            if (i == 0) {
                                                radio.click();
                                            }
                                            choices[i] = radio;
                                        })(choices[i]);
                                    }
                                    list.append("<br />");
                                })(constructs[topic]);
                            }
                            $("#generate").click(function () {
                                $("#choices").hide();
                                $("#loading").show();
                                var request = {
                                    id: data.id,
                                    constructs: {}
                                };

                                for (topic in constructs) {
                                    request.constructs[topic] = [];
                                    var list = constructs[topic];
                                    for (var i = 0; i < list.length; i++) {
                                        if (list[i].prop("checked")) {
                                            request.constructs[topic].push(i);
                                        }
                                    }
                                }

                                API("generate", request, function (data) {
                                    location.href = "/speech/" + data.id;
                                });
                            });
                            $("#loading").hide();
                            $("#choices").show();
                        });
                    });
            })(data[i]);
        }

        $("#loading").hide();
        $("#speakers").show();
    });
});
// }}}

});

/* vim: set fdm=marker: */
