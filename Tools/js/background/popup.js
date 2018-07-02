chrome.tabs.getSelected(null, function(tab) {
    console.log(tab.url)
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
        $('#qrcode')
            .empty()
            .qrcode({
                text: tab.url
            })
    }
})

chrome.history.search({ text: '', maxResults: 5 }, function callback(results) {
    console.log(results)
    $('.his').text(results[0].url)
})

window.onload = () => {
    $('#openLastTab').click(function() {
        chrome.tabs.create({
            url: $('.his').text()
        })
    })
}
