init()

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request)
    var current = localStorage.getItem("current")

    names = JSON.parse(localStorage.getItem("names"))
    if (request.wname) {
        names[current].wname = request.wname
    }
    if (request.tname) {
        names[current].tname = request.tname
    }
    localStorage.setItem("names", JSON.stringify(names))

    sendResponse({ msg: "昵称保存成功" })
})


//http://int.dpool.sina.com.cn/iplookup/iplookup.php


function init() {
    var current = localStorage.getItem("current")
    if (!current) {
        localStorage.setItem("current", 0)
    }

    var sessions = JSON.parse(localStorage.getItem("data_sessions"))
    if (sessions == null || sessions == undefined) {
        sessions = new Array()
        for (var i = 0; i < 5; i++) {
            sessions[i] = {
                "name": "Profile #" + i,
                "cookies": new Array(),
                "created": new Date(),
                "lastUsed": undefined
            }
        }
        localStorage.setItem("data_sessions", JSON.stringify(sessions))
    } else if (sessions.length == 0) {
        sessions = new Array()
        sessions[0] = {
            "name": "Profile #0",
            "cookies": new Array(),
            "created": new Date(),
            "lastUsed": undefined
        }
    }

    var names = JSON.parse(localStorage.getItem("names"))
    if (names == null || names == undefined) {
        names = new Array()
        for (var i = 0; i < 5; i++) {
            names[i] = {
                "wname": "微博昵称",
                "tname": "贴吧昵称"
            }
        }
        localStorage.setItem("names", JSON.stringify(names))
    }
}