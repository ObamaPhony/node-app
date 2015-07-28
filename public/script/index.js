$(function () {
    var punctuation = /[^a-zA-Z0-9 ]+/;
    function fix(value) {
        return value.replace(punctuation, "").replace(/\s/, " ").replace(/ +/, " ");
    }

    $("#userInput").on("keydown keyup", function (e) {
        $(this).val(fix($(this).val()));

        /* enter key */
        if (e.keyCode == 13) {
            $("<input type='text' /><br />").val($(this).val()).appendTo("#nouns-content").on("keydown keyup", function (e) {
                $(this).val(fix($(this).val()));
            });
            $(this).val("");
            $("#nouns").animate({ scrollTop: $("#nouns")[0].scrollHeight });
        }
    });
});
