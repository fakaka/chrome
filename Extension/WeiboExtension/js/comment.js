function comment(data) {

    var card = document.getElementsByClassName("WB_cardwrap WB_feed_type S_bg2 ")[0];
    var mid;
    if (!card) {
        $(".S_txt2 a").each(function () {
            mid = $(this).attr("name");
        });
    }
    mid = $(card).attr("mid");

    var content = data.content + data.count;
    $.ajax({
        url: "http://weibo.com/aj/v6/comment/add?ajwvr=6&__rnd=" + new Date().getTime(),
        type: "POST",
        data: { mid: mid, content: content },
        success: function (res) {
            console.log(res);
            setTimeout(function () {
                chrome.extension.sendMessage({ msg: "next" }, function (response) {
                    console.log(response.message);
                });
            }, 2000);
        }
    });

    console.log('comment:' + content);
}