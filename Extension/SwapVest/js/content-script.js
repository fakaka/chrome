window.onload = function () {
    var weibo_nickname = $(".gn_name em").last().text();
    var tieba_nickname = $(".u_username_title").text();
    if (weibo_nickname)
        console.log("微博昵称:" + weibo_nickname);
    if (tieba_nickname)
        console.log("贴吧昵称:" + tieba_nickname);

    var data = {
        wname: weibo_nickname,
        tname: tieba_nickname
    };
    chrome.extension.sendMessage(data, function (response) {
        console.log(response);
    });

    var btn_add_HTML = '<a href="javascript:void(0)" class="ui_btn ui_btn_m" id="vest_add" title="不要点哦">自动发帖(暂不稳定)</a>'
    $(".j_floating").prepend(btn_add_HTML);
    $("#vest_add").click(function () {
        console.log("贴吧发帖");
        // add_comment();
    });
}