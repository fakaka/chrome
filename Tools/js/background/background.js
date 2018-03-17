
createContextMenu()
liveOnTab()

function createContextMenu() {

    chrome.contextMenus.removeAll()
    var UA_parent = chrome.contextMenus.create({ title: "切换User-Agent" })
    var QRcode_parent = chrome.contextMenus.create({ title: "生成页面二维码" })

}

function liveOnTab() {

    var reopen_tab_id = null;
    var creating_tab = false;
    var activate_tab = false;

    function keep_two() {
        chrome.windows.getAll({ populate: true }, function (windows) {
            var tab_count = 0;
            for (var i = 0; i < windows.length; i++) {
                var w = windows[i];
                tab_count += w.tabs.length;
            }
            if (tab_count == 1 && !creating_tab) {
                creating_tab = true;

                if (w.tabs[0].pinned == true) { activate_tab = true; }
                else { activate_tab = false; }

                chrome.tabs.create({ active: activate_tab, pinned: (w.tabs[0].pinned == false) }, function (tab) {
                    // save this tab id in case of Close Tabs to The Right.
                    // Chrome will close this tab if that is the case even it's just being
                    // added.
                    reopen_tab_id = tab.id;
                    creating_tab = false;
                });
            }
        });
    }
    function close_one(tab) {
        chrome.tabs.getAllInWindow(tab.windowId, function (tabs) {
            if (tabs.length != 3)
                return;
            for (var i = 0, closed = 0; i < tabs.length && closed < tabs.length - 2; i++) {
                if (tabs[i].id == tab.id) //Do not close new tab which is chrome://newtab
                    continue;
                if (tabs[i].url == 'chrome://newtab/' && tabs[i].pinned) {
                    chrome.tabs.remove(tabs[i].id);
                    return;
                }
            }
        });
    }
    keep_two();

    chrome.tabs.onRemoved.addListener(function (tabId) {
        if (reopen_tab_id == tabId) {
            setTimeout(keep_two, 100);
            return;
        }
        keep_two();
    });

    chrome.tabs.onCreated.addListener(function (tab) {
        if (tab.id != reopen_tab_id)
            reopen_tab_id = null;
        close_one(tab);
    });

    chrome.tabs.onActivated.addListener(function (tab) {
        chrome.windows.getAll({ populate: true }, function (windows) {
            var tab_count = 0;
            for (var i = 0; i < windows.length; i++) {
                var w = windows[i];
                tab_count += w.tabs.length;
            }

            if (tab_count == 2 && w.tabs[0].pinned && w.tabs[0].id == tab.tabId && w.tabs[0].url == 'chrome://newtab/') {
                chrome.tabs.update(w.tabs[1].id, { active: true });
            }
        });
    });

}



// chrome.webRequest.onResponseStarted.addListener(function (details) {
//     if (details.url.indexOf("acgvideo.com/vg") != -1) {
//         console.log(details)
//         video_url = details.url
//     }
// }, { urls: ["<all_urls>"] })

// chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message.type == 'video_url')
//         sendResponse({ url: video_url })
// })
