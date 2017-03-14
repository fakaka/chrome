$(document).ready(function () {

    $.getJSON("http://int.dpool.sina.com.cn/iplookup/iplookup.php", { format: "json" }, function (data) {
        console.log(data)
    })
    names = JSON.parse(localStorage.getItem("names"));

    $("table tr").each(function () {
        var idx = $(this).attr("index");
        if (!idx)
            return;
        var current = localStorage.getItem("current");
        if (idx == current) {
            $(this).addClass("success");
        }
        var wname = names[idx].wname;
        if (wname) {
            $(this).find("td").eq(1).text(wname);
        }
        var tname = names[idx].tname;
        if (tname) {
            $(this).find("td").eq(2).text(tname);
        }

    });
    initEvent();
});

function initEvent() {

    $("table tr").each(function () {
        $(this).on("click", function (params) {
            var that = $(this);
            // console.log(that);
            var current = JSON.parse(localStorage.getItem("current"));
            var index = that.attr("index");
            if (index && index != current) {
                $("table tr").each(function () {
                    $(this).removeClass("success");
                });
                that.addClass("success");
                changeSession(index);
            }
        });
    });

    $("#rank").bind("click", function () {
        var data = {
            type: "rank",
            isPublic: true
        };
        sendMessage(data)
    });

    $("#xunyee").bind("click", function () {
        var data = {
            type: "xunyee"
        };
        sendMessage(data);
    });

    $("#baike").bind("click", function () {
        var data = {
            type: "baike"
        };
        sendMessage(data);
    });

    $("#forward").bind("click", function () {
        var mid = localStorage.getItem("mid");
        var contents = localStorage.getItem("contents").split(",");
        var data = {
            type: "forward",
            contents: contents,
            mid: mid
        }
        sendMessage(data);
    });

    $("#choose").bind("click", function () {
        chrome.tabs.query({ active: true }, function (tabs) {
            var reg = /\w*\?/;
            var mid = reg.exec(tabs[0].url)["0"];
            mid = mid.substr(0, mid.length - 1);
            mid = new SinaWeiboUtility().mid2id(mid);
            console.log("mid = " + mid);
            if (mid != "") {
                localStorage.setItem("mid", mid);
            }
        })
    });
}

function sendMessage(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
            $("#message").text(response.message);
        });
    });
}

function changeSession(index) {
    var sessions = JSON.parse(localStorage.getItem("data_sessions"));
    var current = localStorage.getItem("current");
    if (current == index) {
        return;
    }
    chrome.cookies.getAll({}, function (cks) {
        sessions[current].cookies = cks;
        localStorage.setItem("data_sessions", JSON.stringify(sessions));
        deleteCookies(cks);
        localStorage.setItem("current", index);
        restoreCookies(sessions[index].cookies);
    });
}

function deleteCookies(cks) {
    console.log("Deleting " + cks.length + " cookies...");
    for (var i = 0; i < cks.length; i++) {
        var curr = cks[i];
        var url = ((curr.secure) ? "https://" : "http://") + curr.domain + curr.path;
        chrome.cookies.remove({
            "url": url,
            "name": curr.name,
            "storeId": curr.storeId
        });
    }
}

function restoreCookies(cks) {
    console.log("restoreCookies");
    for (var i = 0; i < cks.length; i++) {
        try {
            var current = cks[i];
            var newCookie = {};
            newCookie.url = ((newCookie.secure) ? "https://" : "http://") + current.domain;
            newCookie.name = current.name;
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
    updateTabs();
}

function updateTabs() {
    chrome.windows.getCurrent(function (window) {
        chrome.windows.getAll({ populate: true }, function (windows) {
            console.log(windows)
            for (var i = 0; i < windows.length; i++) {
                var currentWindow = windows[i];
                if (window == null || window.id == currentWindow.id) {
                    var tabs = currentWindow.tabs;
                    for (var j = 0; j < tabs.length; j++) {
                        var currentTab = tabs[j];
                        updateTab(currentTab);
                    }
                    if (window != null)
                        break;
                }
            }
        });
    });

}

function updateTab(tab) {
    if (tab.url.indexOf("https://chrome.google") == 0 || tab.url.indexOf("http://chrome.google") == 0 || tab.url.indexOf("chrome://") == 0) {
    }
    else {
        chrome.tabs.executeScript(tab.id, {
            code: 'window.location.reload(true)'
        }, function () {
            //window.close();
        });
    }
}

function SinaWeiboUtility() {
    this.str62keys = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /**
    * 10进制值转换为62进制
    * @param {String} int10 10进制值
    * @return {String} 62进制值
    */
    SinaWeiboUtility.prototype.int10to62 = function (int10) {
        var s62 = '';
        var r = 0;
        while (int10 != 0) {
            r = int10 % 62;
            s62 = this.str62keys.charAt(r) + s62;
            int10 = Math.floor(int10 / 62);
        }
        return s62;
    };
    /**
    * 62进制值转换为10进制
    * @param {String} str62 62进制值
    * @return {String} 10进制值
    */
    SinaWeiboUtility.prototype.str62to10 = function (str62) {
        var i10 = 0;
        for (var i = 0; i < str62.length; i++) {
            var n = str62.length - i - 1;
            var s = str62.substr(i, 1);  // str62[i]; 字符串用数组方式获取，IE下不支持为“undefined”
            i10 += parseInt(this.str62keys.indexOf(s)) * Math.pow(62, n);
        }
        return i10;
    };
    /**
    * id转换为mid
    * @param {String} id 微博id，如 "201110410216293360"
    * @return {String} 微博mid，如 "wr4mOFqpbO"
    */
    SinaWeiboUtility.prototype.id2mid = function (id) {
        if (typeof (id) != 'string') {
            return false; // id数值较大，必须为字符串！
        }
        var mid = '';

        for (var i = id.length - 7; i > -7; i = i - 7) //从最后往前以7字节为一组读取mid
        {
            var offset1 = i < 0 ? 0 : i;
            var offset2 = i + 7;
            var num = id.substring(offset1, offset2);

            num = this.int10to62(num);
            mid = num + mid;
        }

        return mid;
    };
    /**
    * mid转换为id
    * @param {String} mid 微博mid，如 "wr4mOFqpbO"
    * @return {String} 微博id，如 "201110410216293360"
    */
    SinaWeiboUtility.prototype.mid2id = function (mid) {
        var id = '';

        for (var i = mid.length - 4; i > -4; i = i - 4) //从最后往前以4字节为一组读取mid字符
        {
            var offset1 = i < 0 ? 0 : i;
            var len = i < 0 ? parseInt(mid.length % 4) : 4;
            var str = mid.substr(offset1, len);

            str = this.str62to10(str).toString();
            if (offset1 > 0) //若不是第一组，则不足7位补0
            {
                while (str.length < 7) {
                    str = '0' + str;
                }
            }

            id = str + id;
        }
        return id;
    };

}