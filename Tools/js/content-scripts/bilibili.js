function bilibili() {

    checkLimit()

    console.log('bilibili')

    var picUrl = $('meta[itemprop=image]').attr('content')
    var reportModule = $('#comment')
    var divWidth = reportModule.width()
    var myModule = `<div id="bilibili_helper">
            <div style="padding:5px;">
                <img class="cover" src ="${picUrl}"/>
            </div>
        </div>`

    setTimeout(() => {
        reportModule.before(myModule)
    }, 5000)

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

/**
 * 获取访问限制
 * TODO 从远程获取
 */
function checkLimit() {
    let data = Day.getTodayInfo('bilibili')
    var today = new Date().toLocaleDateString()
    if (data.visit && data.visit[today]) {
        if (data.visit[today] > 5) {
            // alert('今日访问已达上限，超过 ' + (data.visit[d] - 5) + ' 次')
            if (!confirm('今日访问已达上限，超过 ' + (data.visit[today] - 5) + ' 次')) {
                console.log('关闭当前标签页')
            }
        }
        data.visit[today]++
    } else {
        data.visit = {}
        data.visit[today] = 1
    }

    Day.setTodayInfo('bilibili', data)
}

var giftCount
var giftCurr
/** Live 模块  */
function bilibiliLive() {
    giftCount = 0
    giftCurr = 0
    sign()
    setTimeout(() => {
        getBagList()
    }, 1000)
}

/**
 * 直播签到
 */
function sign() {
    $.getJSON('https://api.live.bilibili.com/sign/doSign', function(res) {
        // console.log(res)
        console.log('sign : ' + res.msg)
    })
}

function getBagList() {
    $.getJSON('https://api.live.bilibili.com/gift/v2/gift/bag_list', function(res) {
        // console.log(res)
        if (res.code == 0) {
            var list = res.data.list
            // console.log(list)
            giftCount = list.length
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                bagSend(item.bag_id, item.gift_id, item.gift_num)
            }
        }
    })
}

/**
 *
 * @param {*} bag_id
 * @param {*} gift_id
 * @param {*} gift_num
 */
function bagSend(bag_id, gift_id, gift_num) {
    // console.log(bag_id, gift_id, gift_num)

    var data = {
        uid: 3447141,
        gift_id,
        ruid: 14266048,
        gift_num,
        bag_id,
        platform: 'pc',
        biz_code: 'live',
        biz_id: 46716
        // csrf_token: 'db5fa4c282c44b5f00ca4fa79adbce2b'
    }
    // console.log(data)

    $.ajax({
        url: 'https://api.live.bilibili.com/gift/v2/live/bag_send',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(res) {
            console.log(res.msg)
            giftCurr += 1
            if (giftCurr >= giftCount) {
                notify('送礼成功')
            }
        }
    })
}
