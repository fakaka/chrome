$(document).ready(function () {

    $("#rank").bind("click", function () {
        var data = {
            type: "rank",
            num: 6,
            interval: 4
        };
        sendMessage(data);
    });

    $("#repost").bind("click", function () {
        repostOrComment("repost");
    });

    $("#comment").bind("click", function () {
        repostOrComment("comment");
    });
    $("#comment2").bind("click", function () {
        repostOrComment("comment2");
    });
});

function sendMessage(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
            $("#message").text(response.message);
        });
    });
}

function repostOrComment(type) {
    var con = localStorage.getItem("contents");
    if (!con) {
        return;
    }
    var contents = JSON.parse(con);
    if (!contents) {
        return;
    }
    var isPublic = false;
    var public = $("input[name=public]:checked");
    if (public.length > 0) {
        isPublic = true;
    }
    var cid = localStorage.getItem('cid')

    var data = {
        type: type,
        num: $("#num").val(),
        interval: $("#interval").val(),
        public: isPublic,
        cid: cid,
        contents: contents.contents
    };
    sendMessage(data);
}
