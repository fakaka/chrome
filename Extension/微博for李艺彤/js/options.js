$(document).ready(function () {
    show();

    $("#add").bind("click", function () {

        var value = $("#content").val();
        if (value == "") {
            return;
        }
        $("#content").val('')
        var con = localStorage.getItem("contents");

        if (con == null || con == '{}') {
            var contents = {
                contents: [value]
            };
            localStorage.setItem("contents", JSON.stringify(contents));
        } else {

            var contents = JSON.parse(con);
            var array = contents.contents;
            for (var index = 0; index < array.length; index++) {
                if (value == array[index])
                    return;
            }
            array[array.length] = value;
            localStorage.setItem("contents", JSON.stringify(contents));
        }
        show();
    });

    $("#file").bind("change", function (e) {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (file) {
            var lines = this.result.match(/[^\r\n]+/g);
            console.log(lines);
            localStorage.removeItem("contents");
            var con = JSON.stringify({ contents: lines })
            localStorage.setItem("contents", con);
            show();
        };
        reader.readAsText(file, "utf-8");
    });

    $("#clear").bind("click", function () {
        localStorage.removeItem("contents");
        show();
    })

});

function show() {
    $("#tableBody").empty();
    var con = JSON.parse(localStorage.getItem("contents"));
    if (!con) {
        return;
    }
    var contents = con.contents;
    if (!contents) {
        return;
    }
    var len = contents.length;
    // console.log("有 " + len + " 条文案");

    for (var index = 0; index < len; index++) {
        var num = index + "";
        var content = contents[index];

        var tr = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(num));
        tr.appendChild(td1);

        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(content));
        tr.appendChild(td2);
        document.getElementById("tableBody").appendChild(tr);
    }

}