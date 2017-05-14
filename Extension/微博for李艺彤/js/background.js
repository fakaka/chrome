// (function Notification() {
//     new Notification(new Date().toLocaleString(), {
//         icon: 'img/icon_48.png',
//         body: '开始干活啦！！！'
//     });
// })();
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == 'cid') {
        localStorage.setItem('cid', message.cid)
        sendResponse({ msg: 'cid = ' + message.cid + '添加成功' })
    }
})