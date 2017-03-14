var i = 0;
function baike() {
    $.getJSON("http://baike.baidu.com/operation/api/starflowerrank", { lemmaid: 9549681 }, function (res) {
        baike_flower(res.tk);
    });
}
function baike_flower(tk) {
    var data = {
        lemmaid: 9549681,
        tk: tk
    }
    $.ajax({
        url: "http://baike.baidu.com/operation/api/starflowervote",
        type: "GET",
        data: data,
        dataType: "json",
        success: function (res) {
            // console.log("剩余 ：" + res.leftFlowers);
            if (i++ < 3) {
                baike_flower(tk);
            } else {
                i = 0;
                tieba_sign();
            }
        }
    });
}

/**
 * 贴吧签到
 */
function tieba_sign() {
    $.getJSON("http://tieba.baidu.com/dc/common/tbs", { lemmaid: 9549681 }, function (res) {
        var data = {
            ie: "utf-8",
            kw: "李艺彤",
            tbs: res.tbs
        }
        $.ajax({
            url: "http://tieba.baidu.com/sign/add",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.error) {
                    console.log(res);
                }
            }
        });
    });
}