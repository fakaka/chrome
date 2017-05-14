function comment(data) {
    var array = data.contents;
    if (data.contents.length < data.num) {
        for (var index = data.contents.length, j = 0; index < data.num; index++)
            array[index] = data.contents[j++ % data.num];
    }

    var i = 0;
    var lis = document.getElementsByClassName("WB_row_line WB_row_r4 clearfix S_line2")[0].getElementsByTagName("li");//【收藏，转发，评论，点赞】

    var interval = (data.interval) * 1000;
    var num = setInterval(function () {
        var comment = lis[2].getElementsByClassName("S_txt2")[0];//评论
        var div_comment = lis[2];
        if (div_comment.className != " curr") {//如果不是评论区则点击
            comment.click();
        }
        var textareas = document.getElementsByTagName("textarea");
        var textarea;
        for (var index = 0; index < textareas.length; index++) {//找到评论的文本框
            var element = textareas[index];
            if (textareas[index].getAttribute("node-type") == "textEl" && textareas[index].getAttribute("title") == undefined) {
                textarea = element;
            }
        }
        textarea.value = array[i] + i;
        console.log('comment:' + textarea.value);
        var t = document.getElementsByClassName("btn W_fr");
        var a_comment;
        for (var j = 0; j < t.length; j++) {//找到评论按钮
            if (t[j].childNodes.length == 1) {
                a_comment = t[j].childNodes[0];
            }
        }

        a_comment.click();//点击评论
        i++;
        if (i >= data.num) {
            clearInterval(num);
            i = 0;
        }
    }, interval)
}