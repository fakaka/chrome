var btn_comment = document.getElementsByClassName("ui_btn ui_btn_m j_submit poster_submit")[0];
var div_con = $("#ueditor_replace");
function tieba() {
    add_comment();
}

function add_comment() {
    div_con.empty().append("<p>李艺彤啊，一心向前李艺彤，哈哈哈哈哈" + Math.random() * 100 + "</p>");
    btn_comment.click();
    setTimeout(function () {
        add_comment();
    }, 5000);
}

//TODO 改为楼中楼回复