window.onload = function () {
    setTimeout(function () {
        var newLi = `<li><span class="line S_line1"><a class="S_txt1 m-choose">选择</a></span></li>`
        $('.list_con ul.clearfix').prepend(newLi)
        $('.m-choose').click(function () {
            var commot_div = $(this).parent().parent().parent().parent().parent().parent().parent()
            if (commot_div.attr('node-type') == 'root_comment') {
                var cid = commot_div.attr('comment_id')
                chrome.extension.sendMessage({ type: 'cid', cid: cid }, function (response) {
                    if (response)
                        console.log(response.msg)
                })
            }
        })
    }, 10000)
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        console.log(request);
        switch (request.type) {
            case "repost":
                repost(request);
                break;
            case "comment":
                comment(request);
                break;
            case "comment2":
                reply(request);
                break;
            default:
                break;
        }
    });
};
