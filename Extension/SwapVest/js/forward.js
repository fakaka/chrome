function forward(data) {
    var i = 0
    var mid = data.mid
    var len = data.contents.length
    setInterval(function () {
        var _data = {
            appkey: "",
            mid: mid,
            mark: "",
            text: data.contents[i++ % len] + i,
            style_type: 1,
            location: "",
            _t: 0
        }
        $.ajax({
            url: "http://chart.weibo.com/aj/repost?__rnd=" + new Date().getTime(),
            type: "POST",
            data: _data,
            dataType: "json",
            success: function (res) {
                console.log(res.msg + i)
                if (i == 10) {
                    sendMessage('forward')
                }
            }
        })
    }, 3500)
}