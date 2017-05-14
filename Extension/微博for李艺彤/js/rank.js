var i = 0;
function rank(data) {
    var regExp = new RegExp("^http://weibo.com/3700233717/");
    if (!regExp.test(location.href)) {
        alert("不是 @SNH48-李艺彤的微博");
        return;
    }
    rank_publish(data);
}

function rank_publish(data) {
    if (i == 0) {
        alert("打榜开始");
    }
    var div_publish = $(".W_ficon.ficon_send.S_ficon");
    div_publish.click();
    setTimeout(function () {
        var layers = document.getElementsByClassName("W_layer");
        var layer = layers[2] || layers[1];
        var textarea = layer.getElementsByTagName("textarea")[0];
        var btn_publish = layer.getElementsByClassName("W_btn_a")[0];
        textarea.value = "@SNH48-李艺彤 已经在#明星势力榜#内地榜上为你加油啦，你是我今生唯一的执著哦。棒棒哒！！" + i;
        console.log("publish:" + textarea.value);
        setTimeout(function () {
            btn_publish.click();
            i++;
            setTimeout(function () {
                rank_repost(data);
            }, 8000);
        }, 1000)
    }, 1000);
}

function rank_repost(data) {
    var forward = $(".WB_row_line.WB_row_r4.clearfix.S_line2 > li:nth-child(2) > a")[0];
    forward.click();
    setTimeout(function () {
        var textareas = document.getElementsByTagName("textarea");
        var textarea;
        for (var index = 0; index < textareas.length; index++) {
            if (textareas[index].getAttribute("title") == "转发微博内容") {
                textarea = textareas[index];
                break;
            }
        }
        textarea.value = "@SNH48-李艺彤  我永远支持你！我们一起拿下 #明星势力榜# 第一名！！" + i;
        console.log("repost:" + textarea.value);

        var btns = document.getElementsByClassName("W_btn_a");
        var btn_forward;
        for (var j = 0; j < btns.length; j++) {
            if (btns[j].innerHTML == "转发") {
                btn_forward = btns[j];
                break;
            }
        }
        btn_forward.click();
        i++;
        if (i >= data.num) {
            return;
        }
        setTimeout(function () {
            rank(data);
        }, 9000);
    }, 1000);
}
