createContextMenu()
liveOnTab()

function createContextMenu() {
    chrome.contextMenus.removeAll()
    var UA_parent = chrome.contextMenus.create({ title: '切换User-Agent' })
    var QRcode_parent = chrome.contextMenus.create({ title: '生成页面二维码' })
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message)
    var resp
    if (message.name == 'tab') {
        resp = changeTab(message)
    } else if (message.name == 'notify') {
        notify(message)
    }

    sendResponse(resp)
})

function changeTab(message) {
    var currentTab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        currentTab = tabs[0].index
    })
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
        console.log(tabs)
        if (tabs.length < 2) {
            return { msg: '只有一个 tab 页' }
        }
        var idx
        if (message.data.action == 'prev') {
            idx = (currentTab + tabs.length - 1) % tabs.length
        } else {
            idx = (currentTab + 1) % tabs.length
        }

        chrome.tabs.update(tabs[idx].id, { active: true })
    })
}

function notify(params) {
    chrome.notifications.create('name-for-notification', {
        type: 'basic',
        iconUrl: '../img/icon_48.png',
        title: 'This is a notification',
        message: 'hello there!'
    })
    chrome.notifications.onClicked.addListener(function(notificationId) {
        console.log(notificationId)
    })
}
