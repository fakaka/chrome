chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.type == "rank") {
        rank();
    } else if (request.type == "baike") {
        baike();
    } else if (request.type == "xunyee") {
        xunyee();
    } else if (request.type == "tieba") {
        // tieba();
    } else if (request.type == "forward") {
        forward(request);
    }
});