$(function () {
    $.ajax({
        url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.google.com/trends/hottrends/atom/feed?pn=p1",
        jsonp: "callback",
        dataType: "jsonp",
        success: function (data) {
            var trends = [];
            var feed = data.responseData.feed.entries;
            for (var i = 0; i < feed.length; i++) {
                trends.push(feed[i].title);
            }
        }
    });

    var punctuation = /[^a-zA-Z0-9 ]+/;
    function fix(value) {
        return value.replace(punctuation, "").replace(/\s/, " ").replace(/ +/, " ");
    }

    $("#userInput").on("keydown keyup", function (e) {
        $(this).val(fix($(this).val()));

        /* enter key */
        if (e.keyCode == 13 && $(this).val().trim()) {
            $("<input type='text' /><br />").val($(this).val()).appendTo("#nouns-content").on("keydown keyup", function (e) {
                $(this).val(fix($(this).val()));
            });
            $(this).val("");
            $("#nouns").animate({ scrollTop: $("#nouns")[0].scrollHeight });
        }
    });
});