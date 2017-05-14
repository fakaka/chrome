var video_url = ''
// http://int.dpool.sina.com.cn/iplookup/iplookup.php


initLocalStorage()

chrome.webRequest.onResponseStarted.addListener(function (details) {
    if (details.url.indexOf("acgvideo.com/vg") != -1) {
        console.log(details)
        video_url = details.url
    }
}, { urls: ["<all_urls>"] })

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message.type || message.type != 'nickname')
        return

    var current = localStorage.getItem("current")
    names = JSON.parse(localStorage.getItem("names"))
    if (message.wname) {
        names[current].wname = message.wname
    }
    if (message.tname) {
        names[current].tname = message.tname
    }
    localStorage.setItem("names", JSON.stringify(names))

    if (message.wname || request.tname) {
        sendResponse({ msg: "昵称保存成功" })
    } else {
        sendResponse({ msg: "没有昵称保存" })
    }
})

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == 'video_url')
        sendResponse({ url: video_url })
})

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == 'sign') {
        var item = message.item
        console.log(item)
        var sign = JSON.parse(localStorage.getItem("sign"))
        if (sign.items) {
            sign.items = []
        }
        for (var i = 0; i < sign.items.length; i++) {
            if (sign.items[i] == item) {
                sendResponse({ msg: '已存在' })
                break
            }
        }
        sign.items.push(item)
        sendResponse({ msg: item + '添加' })
    }
})

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == 'cid') {
        localStorage.setItem('cid', message.cid)
        sendResponse({ msg: 'cid = ' + message.cid + '添加成功' })
    }
})

function initLocalStorage() {
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

    var sid = localStorage.getItem("sid")
    if (!sid) {
        $.ajax({
            url: "http://120.25.92.185:3000/sign/sid",
            // url: "http://localhost:3000/sign/sid",
            type: "GET",
            dataType: "json",
            success: function (res) {
                // console.log(res)
                localStorage.setItem("sid", res.sid)
            },
            error: function (res) {
                console.log(res)
            }
        })
    }

    var sign = JSON.parse(localStorage.getItem("sign"))
    // var data = {
    //     'date': '1494217973991', items: ['rank', 'xunyee', 'baidu', 'forward']
    // }
    // localStorage.setItem("sign", JSON.stringify(data))
    if (sign) {
        if (new Date().toDateString() !== new Date(sign.date).toDateString()) {
            localStorage.removeItem('sign')
        }
    }
}