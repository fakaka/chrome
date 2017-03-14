chrome.webRequest.onResponseStarted.addListener(function (details) {
    if (details.url.indexOf("acgvideo.com/vg") != -1) {
        console.log(details);
        url = details.url;
    }
}, { urls: ["<all_urls>"] });

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        'id': 'save',
        'type': 'normal',
        'title': '下载视频',
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {}, function (respose) {
        console.log(respose);
        chrome.downloads.download({
            url: url
        }, function (downloadId) {
            console.log(downloadId)
        });
    });
});


chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    sendResponse({ url: url });
});

