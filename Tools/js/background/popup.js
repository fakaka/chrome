chrome.tabs.getSelected(null, function (tab) {
    console.log(tab.url);
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
        $('#qrcode').empty().qrcode({
            text: tab.url
        })
    }
})