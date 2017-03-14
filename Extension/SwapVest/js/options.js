$(document).ready(function () {
    show();
    $("#reset").on("click", function () {
        localStorage.setItem("count", "0");
    });

    $("#add").bind("click", function () {

        var value = $("#content").val();
        $("#content").val("");
        if (value == "") {
            return;
        }

        var contents = localStorage.getItem("contents");
        var arr = [];
        if (contents != null && contents != undefined && contents != "") {
            arr = contents.split(",")
        }
        arr.push(value);
        localStorage.setItem("contents", arr.join(","));
        show();
    });

    $("#clear").bind("click", function () {
        localStorage.removeItem("contents");
        show();
    })

});

function init() {
}

function show() {
    $("#tableBody").empty();
    var contents = localStorage.getItem("contents");
    console.log(contents);
    if (contents == null||contents=="") {
        return;
    }
    contents = contents.split(",");
    for (var index = 0; index < contents.length; index++) {

        var content = contents[index];
        if (content == "") {
            continue;
        }

        var tr = document.createElement("tr");

        // var td0 = document.createElement("td");
        // var input = document.createElement("input");
        // input.type = "radio";
        // input.name = "choose";
        // input.value = 0;
        // td0.appendChild(input);
        // tr.appendChild(td0);

        var td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(index));
        tr.appendChild(td1);

        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(content));
        tr.appendChild(td2);
        document.getElementById("tableBody").appendChild(tr);
    }

}