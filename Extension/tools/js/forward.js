console.log("脚本插入成功");
var cover = $(".cover_image");
var picUrl = cover.attr("src").toString();
var before = $(".arc-toolbar");
var divWidth = before.width();
var newDiv =
    `<div style="width:${divWidth}px;margin:0 auto;margin-top:10px;background: #fff;color: #444;border: 1px solid #e5e9ef;border-radius: 4px;">
        <div style="padding:5px;">
            <img id="mCover" src ="${picUrl}" width="200px" style="border:1px solid #e5e9ef;border-radius:3px;"/>
            <a id="downloadVideo" href="javascript:void(0)">下载视频</a>
        </div>
    </div>`;
before.after(newDiv);

$("#downloadVideo").click(function () {
    console.log(this);
    chrome.runtime.sendMessage({}, function (response) {
        console.log(response);
        var title = $("h1").text();
        var a = document.createElement("a");
        a.setAttribute("download", title);
        a.setAttribute("href", response.url);
        document.body.appendChild(a);
        var theEvent = document.createEvent("MouseEvent");
        theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(theEvent);
        document.body.removeChild(a);
    });
});