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

    $('.navbar__toogleBtn').click(function () {
        $('.navbar__menu').toggleClass('active');
        $('.navbar__icons').toggleClass('active');
    });
});
