function xunyee() {
    $.getJSON("http://www.xunyee.cn/person/get_sign_identifier", function (res) {
        console.log(res.question);
        answer = eval(parseStr(res.question));
        answer_id = res.id;
        console.log(answer);
        sign(answer, answer_id);
    });
}

function sign(answer, answer_id) {
    $.ajax({
        url: "http://www.xunyee.cn/person/sign",
        type: "POST",
        data: { person_id: "193541", answer: answer, answer_id: answer_id },
        dataType: "json",
        success: function (res) {
            if (res.msg == "签到成功。") {
                console.log(res.msg);
            } else if (res.msg == "回答错误") {
                xunyee();
            }
        }
    });
}
/**
 * 解析简单的计算表达式
 */
function parseStr(str) {
    str = str.substr(0, str.length - 1);
    str = str.replace("加上", "+").replace("减去", "-").replace("乘以", "*").replace("除以", "/");
    str = str.replace("加", "+").replace("减", "-").replace("乘", "*");

    str = str.replace("二十", "20").replace("三十", "30").replace("四十", "40").replace("五十", "50");
    str = str.replace("六十", "60").replace("七十", "70").replace("八十", "80").replace("九十", "90");

    str = str.replace("十一", "11").replace("十二", "12").replace("十三", "13").replace("十四", "14").replace("十五", "15");
    str = str.replace("十六", "16").replace("十七", "17").replace("十八", "18").replace("十九", "19");

    str = str.replace("一", "1").replace("二", "2").replace("三", "3").replace("四", "4").replace("五", "5");
    str = str.replace("六", "6").replace("七", "7").replace("八", "8").replace("九", "9").replace("十", "").replace("十", "");

    return str;
}