console.log('create menus')

function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked")
    console.log("info: " + JSON.stringify(info))
    console.log("tab: " + JSON.stringify(tab))
}

function changeBG(){
    console.log('change color')

}

var UA_parent = chrome.contextMenus.create({ title: "切换User-Agent" })
var BG_parent = chrome.contextMenus.create({ title: '改变背景色' ,onclick: changeBG()})
var QRcode_parent = chrome.contextMenus.create({ title: "生成页面二维码" })

var default_option = chrome.contextMenus.create({
    title: 'Default',
    parentId: UA_parent,
    onclick: genericOnClick
})
var separator1 = chrome.contextMenus.create({
    title: "separator1",
    type: 'separator',
    parentId: UA_parent,
    onclick: genericOnClick
})
var UA_chrome = chrome.contextMenus.create({
    title: 'Chrome',
    parentId: UA_parent,
    onclick: genericOnClick
})
var UA_Chrome_on_Windows = chrome.contextMenus.create({
    title: 'Chrome on Windows',
    parentId: UA_chrome,
    onclick: genericOnClick
})
var UA_Chrome_on_Mac = chrome.contextMenus.create({
    title: 'Chrome on Mac',
    parentId: UA_chrome,
    onclick: genericOnClick
})
var UA_Chrome_on_Android_Mobile = chrome.contextMenus.create({
    title: 'Chrome on Android Mobile',
    parentId: UA_chrome,
    onclick: genericOnClick
})