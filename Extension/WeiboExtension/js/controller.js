window.onload = function () {

    console.log(document.title + "页面加载完成");

    var weibo_nickname = $(".gn_name em").last().text();
    if (weibo_nickname)
        console.log("微博昵称:" + weibo_nickname);

    chrome.extension.sendMessage({ wname: weibo_nickname }, function (response) {
        console.log(response);
    });

    var ficon = document.getElementsByClassName("W_ficon ficon_user S_ficon");
    var data;
    if (ficon.length > 0) {
        data = { msg: "start" };
    } else {
        data = { msg: "next" };
    }
    chrome.extension.sendMessage(data, function (response) {
        console.log(response.message);
    });
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        console.log(request);
        sendResponse({
            message: "start"
        });
        switch (request.type) {
            case "rank":
                rank(request);
                break;
            case "forward":
                forward(request);
                break;
            case "comment":
                comment(request);
                break;
            default:
                break;
        }
    });
}