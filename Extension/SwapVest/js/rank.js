var i = 0
var publishText = "@SNH48-李艺彤 已经在#明星势力榜#内地榜上为你加油啦，你是我今生唯一的执著哦。棒棒哒！​"
var forwardText = "@SNH48-李艺彤 我永远支持你！我们一起拿下 #明星势力榜# 第一名！​"
function rank() {
    var regExp = new RegExp("^http://weibo.com/3700233717/")
    if (!regExp.test(location.href)) {
        alert("不是 @SNH48-李艺彤 的微博")
    }
    rank_publish()
}

/**
 * 势力榜发布
 * 
 */
function rank_publish(data) {
    var timer = setInterval(function () {
        $.ajax({
            url: " http://weibo.com/p/aj/v6/mblog/add?ajwvr=6&domain=100505&__rnd=" + new Date().getTime(),
            type: "POST",
            data: { text: publishText + i, rank: 0 },
            dataType: "json",
            success: function (res) {
                console.log(res)
            }
        })
        console.log("rank_publish:" + publishText + (i++))
        if (i >= 6) {
            clearInterval(timer)
            i = 0
            rank_forward()
        }
    }, 7000)
}

/**
 * 势力榜转发
 */
function rank_forward() {
    var timer = setInterval(function () {
        var mid = $('.WB_cardwrap.WB_feed_type.S_bg2 ').attr('mid')
        var data = {
            mid: 4104157558113011,
            style_type: 2,
            reason: forwardText + i,
            location: 'page_100505_single_weibo',
            pdetail: 1005053700233717,
            rank: 0
        }

        $.ajax({
            url: "http://weibo.com/aj/v6/mblog/forward?ajwvr=6&domain=100505&__rnd=" + new Date().getTime(),
            type: "POST",
            data: data,
            dataType: "json",
            success: function (res) {
                console.log(res)
            }
        })
        console.log("rank_forward:" + forwardText + (i++))
        if (i >= 6) {
            clearInterval(timer)
            i = 0
            sendMessage('rank')
        }
    }, 7000)
}

