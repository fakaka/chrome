$(document).ready(function () {
    init();

    $("#auto").on("click", function () {
        var auto = localStorage.getItem("auto");
        if (auto == "for") {
            localStorage.setItem("auto", "com");
            $("#auto").text("自动评论");
        } else if (auto == "com") {
            localStorage.setItem("auto", "off");
            $("#auto").text("关闭自动");
        } else if (auto == "off") {
            localStorage.setItem("auto", "for");
            $("#auto").text("自动转发");
        }
    });

    $("#reset").on("click", function () {
        localStorage.setItem("count", "0");
    });

    $("#add").bind("click", function () {

        var value = $("#content").val();
        $("#content").val("");
        if (value == "") {
            return;
        }

        localStorage.setItem("content", value);

        // var content = localStorage.getItem("content");
        // if (con == null || con == '{}') {
        //     var contents = {
        //         contents: [value]
        //     };
        //     localStorage.setItem("contents", JSON.stringify(contents));
        // } else {

        //     var contents = JSON.parse(con);
        //     var array = contents.contents;
        //     for (var index = 0; index < array.length; index++) {
        //         if (value == array[index])
        //             return;
        //     }
        //     array[array.length] = value;
        //     localStorage.setItem("contents", JSON.stringify(contents));
        // }

        show();
    });

    $("#clear").bind("click", function () {
        localStorage.removeItem("content");
        show();
    })

});

function init() {
    var auto = localStorage.getItem("auto");
    if (auto == "off") {
        $("#auto").text("关闭自动");
    } else if (auto == "com") {
        $("#auto").text("自动评论");
    } else if (auto == "for") {
        $("#auto").text("自动转发");
    }

    show();
}

function show() {
    $("#tableBody").empty();
    var content = localStorage.getItem("content");
    for (var index = 0; index < 1; index++) {
        var num = index + "";

        var tr = document.createElement("tr");

        var td0 = document.createElement("td");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "choose";
        input.value = 0;
        td0.appendChild(input);
        tr.appendChild(td0);

        var td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(num));
        tr.appendChild(td1);

        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(content));
        tr.appendChild(td2);
        document.getElementById("tableBody").appendChild(tr);
    }

}