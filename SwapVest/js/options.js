$(document).ready(function () {
    show()
    initEvent()

    var kid = localStorage.getItem("kid")
    if (kid) {
        $('#kid').text(kid)
    }
})

function initEvent() {
    // 添加文案
    $("#add").bind("click", function () {
        addContent()
    })

    // 获取文案
    $("#get").bind("click", function () {
        $.ajax({
            url: "http://120.25.92.185:3000/doc",
            type: "GET",
            dataType: "json",
            success: function (res) {
                console.log(res)
                var contents = localStorage.getItem("contents")
                var arr = []
                if (contents != null && contents != undefined && contents != "") {
                    arr = contents.split("#_#")
                }
                for (var i = 0; i < res.length; i++) {
                    arr.push(res[i].content)
                }
                localStorage.setItem("contents", arr.join("#_#"))
                show()
            },
            error: () => {
                console.log('连接错误')
            }
        })
    })

    // 文本框回车键事件
    $("#content").bind("keyup", function (event) {
        if (event.keyCode == 13)
            addContent()
    })

    // 清空文案
    $("#clear").bind("click", function () {
        localStorage.removeItem("contents")
        show()
    })

    // 签到
    $("#sign").bind("click", function () {
        var sign = JSON.parse(localStorage.getItem("sign"))
        if (sign && sign.items.length == 4) {
            var kid = localStorage.getItem("kid")
            var data = { kid: kid }
            $.ajax({
                url: 'http://120.25.92.185:3000/sign',
                type: 'GET',
                data: data,
                success: function (res) {
                    console.log(res.msg)
                }
            })
        } else {
            alert('请完成所有任务再签到')
        }
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