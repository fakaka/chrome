function publish() {
    var i = 0;
    var num = setInterval(function () {

        var div_publish = document.getElementsByClassName("W_ficon ficon_send S_ficon")[0];
        div_publish.click();
        setTimeout(function () {
            var div_content = document.getElementsByClassName("content");
            var publishArea;
            var a_publish;
            for (var index = 0; index < div_content.length; index++) {
                var element = div_content[index].getElementsByClassName("send_weibo");
                var a_element = div_content[index].getElementsByClassName("W_btn_a btn_30px");
                if (element.length != 0) {
                    publishArea = element[0];
                    a_publish = a_element[0];
                }
            }
            textarea = publishArea.getElementsByTagName("textarea")[0];
            textarea.click()
            textarea.value = "@SNH48-李艺彤 已经在#明星势力榜#内地榜上为你加油啦，你是我今生唯一的执著哦。棒棒哒！" + i;

            setTimeout(function () {
                a_publish.click();
                i++;
                if (i >= 8) {
                    clearInterval(num);
                    i = 0;
                    forward();
                }
            }, 700)
        }, 700);
    }, 6000)
    return num;
}