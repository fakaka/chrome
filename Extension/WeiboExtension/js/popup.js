$(document).ready(function () {

    $("#profile>button").each(function () {
        $(this).on("click", function (params) {
            restoreSession(this.value);
        })
    });

    $("#comment").bind("click", function () {
        var data = {
            type: "comment",
            content: "123456789"
        }
        sendMessage(data);
    });

    names = JSON.parse(localStorage.getItem("names"));

    $("table tr").each(function () {
        var idx = $(this).attr("index");
        if (!idx)
            return;
        // console.log(names[idx]);
        var current = localStorage.getItem("current");
        if (idx == current) {
            $(this).addClass("active");
        }
        var wname = names[idx].wname;
        if (wname) {
            $(this).find("td").eq(1).text(wname);
        }
    });

    $("table tr").each(function () {
        $(this).on("click", function (params) {
            var that = $(this);
            // console.log(that);
            var current = JSON.parse(localStorage.getItem("current"));
            var index = that.attr("index");
            if (index && index != current) {
                $("table tr").each(function () {
                    $(this).removeClass("active");
                });
                that.addClass("active");
                restoreSession(index);
            }
        });
    });

});

function sendMessage(data) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
            $("#message").text(response.message);
        });
    });
}

function forwardOrComment(type) {
    var con = localStorage.getItem("contents");
    if (!con) {
        return;
    }
    var contents = JSON.parse(con);
    if (!contents) {
        return;
    }
    var isPublic = true;
    var public = $("input[name=public]:checked");
    if (public.length > 0) {
        isPublic = false;
    }
    var data = {
        type: type,
        num: $("#num").val(),
        interval: $("#interval").val(),
        public: isPublic,
        contents: contents.contents
    };
    sendMessage(data);
}

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
                console.log(current.value)
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