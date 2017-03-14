var init = {
    current: 0,
    count: 1,
    auto: "off"
}
var firstRun = localStorage.getItem("firstRun");
if (!firstRun) {
    localStorage.setItem("current", init.current);
    localStorage.setItem("count", init.count);
    localStorage.setItem("auto", init.auto);
    localStorage.setItem("firstRun", false);
}

var current = localStorage.getItem("current");
chrome.browserAction.setBadgeText({
    text: current
});

sessions = JSON.parse(localStorage.getItem("data_sessions"));
if (sessions == null || sessions == undefined) {
    sessions = new Array();
    for (var i = 0; i < 10; i++) {
        sessions[i] = {
            "name": "New Profile #" + i,
            "cookies": new Array(),
            "created": new Date(),
            "lastUsed": undefined
        };
    }
    localStorage.setItem("data_sessions", JSON.stringify(sessions));
} else if (sessions.length == 0) {
    sessions = new Array();
    sessions[0] = {
        "name": "New Profile #0",
        "cookies": new Array(),
        "created": new Date(),
        "lastUsed": undefined
    };
}

names = JSON.parse(localStorage.getItem("names"));
if (names == null || names == undefined) {
    names = new Array();
    for (var i = 0; i < 10; i++) {
        names[i] = {
            "wname": "微博昵称",
            "tname": "贴吧昵称"
        };
    }
    localStorage.setItem("names", JSON.stringify(names));
}

chrome.cookies.getAll({}, function (cks) {
    // console.log(cks);
    sessions[current].cookies = cks;
    localStorage.setItem("data_sessions", JSON.stringify(sessions));
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.msg == undefined) {
        var current = localStorage.getItem("current");
        names = JSON.parse(localStorage.getItem("names"));
        if (request.wname) {
            names[current].wname = request.wname;
        }
        localStorage.setItem("names", JSON.stringify(names));
    }
    if (request.msg == "next") {
        var auto = localStorage.getItem("auto");
        if (auto == "off")
            return;
        var n = parseInt(localStorage.getItem("current")) + 1;
        restoreSession(n % 10);
    } else if (request.msg == "start") {
        var auto = localStorage.getItem("auto");
        if (auto == "off") {
            return;
        }
        var content = localStorage.getItem("content");
        var count = localStorage.getItem("count");
        localStorage.setItem("count", parseInt(count) + 1);

        var data = {
            type: "forward",
            count: count,
            isPublic: true,
            content: content
        };
        if (auto == "com") {
            data.type = "comment";
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, data, function (response) {

            });
        });
        sendResponse({ msg: "on" });
    }
    sendResponse({ message: "ok" });
});

function restoreSession(index) {
    var sessions = JSON.parse(localStorage.getItem("data_sessions"));
    var current = localStorage.getItem("current");
    chrome.cookies.getAll({}, function (cks) {
        sessions[current].cookies = cks;
        localStorage.setItem("data_sessions", JSON.stringify(sessions));
        deleteCookies(cks);
        localStorage.setItem("current", index);
        chrome.browserAction.setBadgeText({
            text: index + ""
        });
        restoreCookies(sessions[index].cookies);
    });
}

function restoreCookies(cks) {
    for (var i = 0; i < cks.length; i++) {
        try {
            var current = cks[i];
            var newCookie = {};
            newCookie.url = ((newCookie.secure) ? "https://" : "http://") + current.domain;
            newCookie.name = current.name;
            if (current.name == "un") {
                console.log("当前用户id为 :" + current.value);
            }
            newCookie.storeId = current.storeId;
            newCookie.value = current.value;
            if (!current.hostOnly)
                newCookie.domain = current.domain;
            newCookie.path = current.path;
            newCookie.secure = current.secure;
            newCookie.httpOnly = current.httpOnly;
            if (!current.session)
                newCookie.expirationDate = current.expirationDate;
            chrome.cookies.set(newCookie);
        } catch (err) {
            console.error("Error catched restoring cookie:\n" + err.description);
        }
    }
    reloadFunction();
}

function reloadFunction() {
    chrome.tabs.getSelected(null, function (tab) {
        if (tab.url.indexOf("https://chrome.google") == 0 || tab.url.indexOf("http://chrome.google") == 0 || tab.url.indexOf("chrome://") == 0) {
            if (tab.url.indexOf("profileChooser.html") >= 0)
                return;
            chrome.tabs.update(tab.id, {
                "url": tab.url,
                "selected": tab.selected
            });

        } else {
            chrome.tabs.executeScript(tab.id, {
                code: 'window.location.reload(true)'
            }, function () { });
        }
        return;
    });

}

function deleteCookies(cks) {
    console.log("Deleting " + cks.length + " cookies...");
    for (var i = 0; i < cks.length; i++) {
        try {
            var curr = cks[i];
            var url = ((curr.secure) ? "https://" : "http://") + curr.domain + curr.path;
            deleteCookie(url, curr.name, curr.storeId);
        } catch (err) {
            console.error("Error catched deleting cookie:\n" + err.description);
        }
    }
}

function deleteCookie(url, name, storeId) {
    //If no real url is available use: "https://" : "http://" + domain + path
    chrome.cookies.remove({
        "url": url,
        "name": name,
        "storeId": storeId
    });
}