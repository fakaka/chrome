$(document).ready(function () {
    show()
    initEvent()
})

function initEvent() {
    // 添加文案
    $("#add").bind("click", function () {
        addContent()
    })

    // 获取文案
    $("#add").bind("click", function () {
        addContent()
    })

    // 文本框回车事件
    $("#content").bind("keyup", function (event) {
        if (event.keyCode == 13)
            addContent()
    })

    // 清空文案
    $("#clear").bind("click", function () {
        localStorage.removeItem("contents")
        show()
    })
}

/**
 * 添加文案
 */
function addContent() {
    var value = $("#content").val().trim()
    $("#content").val("")
    if (value == "") {
        return
    }
    var contents = localStorage.getItem("contents")
    var arr = []
    if (contents != null && contents != undefined && contents != "") {
        arr = contents.split("#_#")
    }
    arr.push(value)
    localStorage.setItem("contents", arr.join("#_#"))
    show()
}

function show() {
    $("#tableBody").empty()
    var contents = localStorage.getItem("contents")
    console.log('全部文案是 ' + contents)
    if (contents == undefined || contents == "") {
        return
    }
    contents = contents.split("#_#")
    for (var index = 0; index < contents.length; index++) {
        var content = contents[index]
        var tr = document.createElement("tr")

        // var td0 = document.createElement("td")
        // var input = document.createElement("input")
        // input.type = "radio"
        // input.name = "choose"
        // input.value = 0
        // td0.appendChild(input)
        // tr.appendChild(td0)

        var td1 = document.createElement("td")
        td1.appendChild(document.createTextNode(index))
        tr.appendChild(td1)

        var td2 = document.createElement("td")
        td2.appendChild(document.createTextNode(content))
        tr.appendChild(td2)
        document.getElementById("tableBody").appendChild(tr)
    }

}