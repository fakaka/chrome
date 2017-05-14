function repost(data) {

    var array = data.contents;
    if (data.contents.length < data.num) {
        for (var index = data.contents.length, j = 0; index < data.num; index++)
            array[index] = data.contents[j++ % data.num];
    }

    var oldValue = "";
    var i = 0;
    var interval = (data.interval) * 1000;
    var lis = document.getElementsByClassName("WB_row_line WB_row_r4 clearfix S_line2")[0].getElementsByTagName("li");

    var num = setInterval(function () {
        var forward = lis[1].getElementsByClassName("S_txt2")[0];
        var div_forward = lis[1];
        if (div_forward.className != " curr") {
            forward.click();
        }
        var textareas = document.getElementsByTagName("textarea");
        var textarea;
        for (var index = 0; index < textareas.length; index++) {
            if (textareas[index].getAttribute("title") == "转发微博内容") {
                textarea = textareas[index];
            }
        }
        if (i == 0 && textarea.value != "请输入转发理由")
            oldValue = textarea.value;
        textarea.value = array[i] + i + oldValue;
        console.log("repost:" + textarea.value);
        if (data.public) {
            $("span.W_autocut").click();
            setTimeout(function () {
                $(".W_icon.icon_type_self").click();
                setTimeout(function () {
                    var t = document.getElementsByClassName("W_btn_a");
                    var a_forward;
                    for (var j = 0; j < t.length; j++) {
                        if (t[j].innerHTML == "发布") {
                            a_forward = t[j];
                            break;
                        }
                    }
                    a_forward.click();
                    i++;
                    // var warn = document.getElementsByClassName("W_layer W_translateZ")[0];
                    if (i >= data.num) {
                        clearInterval(num);
                        i = 0;
                    }
                }, 1000);
            }, 1000);

        } else {
            var t = document.getElementsByClassName("W_btn_a");
            var a_forward;
            for (var j = 0; j < t.length; j++) {
                if (t[j].innerHTML == "转发") {
                    a_forward = t[j];
                    break;
                }
            }
            a_forward.click();
            i++;
            // var warn = document.getElementsByClassName("W_layer W_translateZ")[0];
            if (i >= data.num) {
                clearInterval(num);
                i = 0;
            }
        }
    }, interval);
}