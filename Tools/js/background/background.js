console.log('create menus')

// function genericOnClick(info, tab) {
//     console.log("item " + info.menuItemId + " was clicked")
//     console.log("info: " + JSON.stringify(info))
//     console.log("tab: " + JSON.stringify(tab))
// }

// function changeBG() {
//     console.log('change color')

// }






// var default_option = chrome.contextMenus.create({
//     title: 'Default',
//     parentId: UA_parent,
//     onclick: genericOnClick
// })
// var separator1 = chrome.contextMenus.create({
//     title: "separator1",
//     type: 'separator',
//     parentId: UA_parent,
//     onclick: genericOnClick
// })
// var UA_chrome = chrome.contextMenus.create({
//     title: 'Chrome',
//     parentId: UA_parent,
//     onclick: genericOnClick
// })
// var UA_Chrome_on_Windows = chrome.contextMenus.create({
//     title: 'Chrome on Windows',
//     parentId: UA_chrome,
//     onclick: genericOnClick
// })
// var UA_Chrome_on_Mac = chrome.contextMenus.create({
//     title: 'Chrome on Mac',
//     parentId: UA_chrome,
//     onclick: genericOnClick
// })
// var UA_Chrome_on_Android_Mobile = chrome.contextMenus.create({
//     title: 'Chrome on Android Mobile',
//     parentId: UA_chrome,
//     onclick: genericOnClick
// })


settings = JSON_Settings;
userAgents = JSON_UserAgentsList

createContextMenu();

function createContextMenu() {
    chrome.contextMenus.removeAll();
    var UA_parent = chrome.contextMenus.create({ title: "切换User-Agent" });
    var BG_parent = chrome.contextMenus.create({
        title: '改变背景色', onclick: () => {
            console.log('66')
        }
    });
    var QRcode_parent = chrome.contextMenus.create({ title: "生成页面二维码" });

    chrome.contextMenus.create({
        id: "Default",
        parentId: UA_parent,
        contexts: ["all"],
        title: "Default"
    });
    chrome.contextMenus.create({
        contexts: ["all"],
        parentId: UA_parent,
        type: "separator"
    });
    userAgents.forEach(function (n) {
        if (n.UserAgents.length != 0) {
            var t = chrome.contextMenus.create({
                id: n.Id,
                parentId: UA_parent,
                contexts: ["all"],
                title: n.Name,
                type: "normal"
            })
            var i = n.UserAgents.forEach(function (i) {
                chrome.contextMenus.create({
                    id: i.Id,
                    parentId: n.Id,
                    contexts: ["all"],
                    title: i.Name,
                    type: "checkbox",
                });
            })
        }
    });
    chrome.contextMenus.create({
        contexts: ["all"],
        parentId: UA_parent,
        type: "separator"
    });
    chrome.contextMenus.create({
        contexts: ["all"],
        parentId: UA_parent,
        onclick: function () {
            return chrome.tabs.create({
                url: "options.html"
            }), !1
        },
        title: "Options",
        type: "normal"
    });
    chrome.contextMenus.create({
        contexts: ["all"],
        parentId: UA_parent,
        onclick: function () {
            return chrome.tabs.create({
                url: "http://www.esolutions.se/whatsmyinfo"
            }), !1
        },
        title: "Show User-agent",
        type: "normal"
    })
}

