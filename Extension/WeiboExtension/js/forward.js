function forward(data) {

    var card = document.getElementsByClassName("WB_cardwrap WB_feed_type S_bg2 ")[0];
    var mid = card.getAttribute("mid");

    var div_lis = document.getElementsByClassName("WB_row_line WB_row_r4");
    if (div_lis == undefined) {
        console.log("end");
        chrome.extension.sendMessage({ msg: "next" }, function (response) {
            console.log(response.message);
        });
    }
    var lis = div_lis[0].getElementsByTagName("li");

    var forward = lis[1].getElementsByClassName("S_txt2")[0];
    var div_forward = lis[1];
    if (div_forward.className != " curr") {
        forward.click();
    }
    //获取文本框的值
    var textareas = document.getElementsByTagName("textarea");
    var textarea;
    for (var index = 0; index < textareas.length; index++) {
        if (textareas[index].getAttribute("title") == "转发微博内容") {
            textarea = textareas[index];
        }
    }
    var oldValue = "";
    if (textarea.value != "请输入转发理由" && textarea.value != undefined)
        oldValue = textarea.value;
    var reason = data.content + data.count + oldValue;
    console.log("forward:" + reason);

    var rank = 0;
    if (!data.public) {//对自己可见
        rank = 1;
    }
    $.ajax({
        url: "http://weibo.com/aj/v6/mblog/forward?ajwvr=6&domain=100505&__rnd=" + new Date().getTime(),
        type: "POST",
        data: { mid: mid, reason: reason, rank: rank },
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    })
    setTimeout(function () {
        chrome.extension.sendMessage({ msg: "next" }, function (response) {
            console.log(response.message);
        });
    }, 2000);
}