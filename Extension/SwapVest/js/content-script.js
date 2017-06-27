window.onload = () => {
    console.log("脚本插入成功")
    var url = window.location.href

    if (url.startsWith('http://www.bilibili.com/video')) {
        // initBilibili()
    } else if (url.indexOf('weibo.com') != -1 || url.indexOf('baidu.com')) {
        nickname()
    }

    /* 超级话题 开始 */
    var data = {
        api: "http://i.huati.weibo.com/aj/supercheckin",
        texta: "签到",
        textb: "已签到",
        id: "100808c0467c0e6a094d4a627ad2c4142c4278",
        location: "page_100808_super_index",
        __rnd: new Date().getTime()
    }
    $.getJSON('http://weibo.com/p/aj/general/button', data, (data) => {
        console.log(data.msg)
    })
    /* 超级话题 结束 */
    setTimeout(function () {
        var newLi = `<li><span class="line S_line1"><a class="S_txt1 m-choose">选择</a></span></li>`
        $('.list_con ul.clearfix').prepend(newLi)
        $('.m-choose').click(function () {
            var commot_div = $(this).parent().parent().parent().parent().parent().parent().parent()
            if (commot_div.attr('node-type') == 'root_comment') {
                var cid = commot_div.attr('comment_id')
                console.log()
                chrome.extension.sendMessage({ type: 'cid', cid: cid }, function (response) {
                    if (response)
                        console.log(response.msg)
                })
            }
        })
    }, 2000)


}

/**
 * B站
 */
function initBilibili() {
    console.log('bilibili')
    var cover = $(".cover_image")
    var picUrl = cover.attr("src")
    var before = $(".arc-toolbar")
    var divWidth = before.width()
    var newDiv =
        `<div style="width:${divWidth}px;margin:0 auto;margin-top:10px;background: #fff;color: #444;border: 1px solid #e5e9ef;border-radius: 4px;">
            <div style="padding:5px;">
                <img id="mCover" src ="${picUrl}" width="200px" style="border:1px solid #e5e9ef;border-radius:3px;"/>
                <a id="downloadVideo" href="javascript:void(0)" class="">下载视频</a>
            </div>
        </div>`
    before.after(newDiv)

    $("#downloadVideo").click(function () {
        console.log(this)
        chrome.runtime.sendMessage({ type: 'video_url' }, function (response) {
            console.log(response)
            var title = $("h1").text()
            var a = document.createElement("a")
            a.setAttribute("download", title)
            a.setAttribute("href", response.url)
            document.body.appendChild(a)
            var theEvent = document.createEvent("MouseEvent")
            theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(theEvent)
            document.body.removeChild(a)
        })
    })
}

function nickname() {
    var weibo_nickname = $(".gn_name em").last().text()
    var tieba_nickname = $(".u_username_title").text()
    if (weibo_nickname)
        console.log("微博昵称:" + weibo_nickname)
    if (tieba_nickname)
        console.log("贴吧昵称:" + tieba_nickname)

    chrome.extension.sendMessage({ type: 'nickname', wname: weibo_nickname, tname: tieba_nickname }, function (response) {
        if (response)
            console.log(response.msg)
    })
}

function sendMessage(item) {
    var data = {
        type: 'sign',
        item: item
    }
    chrome.extension.sendMessage(data, function (response) {
        if (response)
            console.log(response.msg)
    })
}