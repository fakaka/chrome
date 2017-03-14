var i = 0;
var txt = "@SNH48-李艺彤 已经在#明星势力榜#内地榜上为你加油啦，你是我今生唯一的执著哦。棒棒哒！​";
function rank() {
    var regExp = new RegExp("^http://weibo.com/3700233717/");
    if (!regExp.test(location.href)) {
        alert("不是@SNH48-李艺彤的微博");
    }
    super_topic();
}

function super_topic() {
    var data = {
        api: "http://i.huati.weibo.com/aj/supercheckin",
        texta: "签到",
        textb: "已签到",
        id: "100808c0467c0e6a094d4a627ad2c4142c4278",
        location: "page_100808_super_index",
        __rnd: new Date().getTime()
    }
    $.ajax({
        url: "http://weibo.com/p/aj/general/button",
        type: "GET",
        data: data,
        dataType: "json",
        success: function (res) {
            console.log(res);
        }
    });
    console.log("sign in");
    rank_publish();
}

function rank_publish(data) {
    var num = setInterval(function () {
        $.ajax({
            url: " http://weibo.com/p/aj/v6/mblog/add?ajwvr=6&domain=100505&__rnd=" + new Date().getTime(),
            type: "POST",
            data: { text: txt + i, rank: 0 },
            dataType: "json",
            success: function (res) {
                console.log(res);
            }
        });
        console.log("rank_publish:" + txt + (i++));
        if (i >= 6) {
            clearInterval(num);
            i = 0;
            rank_forward();
        }
    }, 6000);
}

function rank_forward() {
    var num = setInterval(function () {
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

            var oldValue = "";
            if (textarea.value != "请输入转发理由" && textarea.value != undefined)
                oldValue = textarea.value;
            textarea.value = "@SNH48-李艺彤 我永远支持你！我们一起拿下 #明星势力榜# 第一名！！" + i + oldValue;
            console.log("forward:" + textarea.value);

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
            if (i >= 6) {
                clearInterval(num);
                return;
            }
        }, 1000);
    }, 6000);
}
