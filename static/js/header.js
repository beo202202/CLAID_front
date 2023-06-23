$(document).ready(function () {
    $.ajax({
        url: "/header.html",
        method: "GET",
        async: false,
        success: function (data) {
            $("header").html(data);
            $(document).trigger("headerLoaded");
        }
    });
});
