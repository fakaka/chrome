console.log('createContextMenu')


createContextMenu()

function createContextMenu() {

    chrome.contextMenus.removeAll()
    var UA_parent = chrome.contextMenus.create({ title: "切换User-Agent" })
    var QRcode_parent = chrome.contextMenus.create({ title: "生成页面二维码" })

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
