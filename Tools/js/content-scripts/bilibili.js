function bilibili() {
    console.log('bilibili')

    var picUrl = $(".cover_image").attr("src")
    var reportModule = $(".arc-toolbar")
    var divWidth = reportModule.width()
    var myModule =
        `<div style="width:${divWidth}px;margin:0 auto;margin-top:10px;background: #fff;color: #444;border: 1px solid #e5e9ef;border-radius: 4px;">
            <div style="padding:5px;">
                <img id="mCover" src ="${picUrl}" width="200px" style="border:1px solid #e5e9ef;border-radius:3px;"/>
            </div>
        </div>`
    reportModule.after(myModule)

    // <a id="downloadVideo" href="javascript:void(0)" class="">下载视频</a>
    // $("#downloadVideo").click(function () {
    //     console.log(this)
    //     chrome.runtime.sendMessage({ type: 'video_url' }, function (response) {
    //         console.log(response)
    //         var title = $("h1").text()
    //         var a = document.createElement("a")
    //         a.setAttribute("download", title)
    //         a.setAttribute("href", response.url)
    //         document.body.appendChild(a)
    //         var theEvent = document.createEvent("MouseEvent")
    //         theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    //         a.dispatchEvent(theEvent)
    //         document.body.removeChild(a)
    //     })
    // })

}
