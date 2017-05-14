function reply(data) {
    var i = 0
    var len = data.contents.length
    setInterval(function () {
        var card = $('.WB_cardwrap.WB_feed_type.S_bg2')
        var mid = card.attr('mid')
        var ouid = card.attr('tbinfo').substr(5)

        var gn_name = $('.gn_name')
        var uid = gn_name.attr('href').match(/\d{6,12}/)

        var _data = {
            act: 'reply',
            mid: mid,// 原博
            cid: data.cid,// 原评论
            uid: uid,
            forward: 0,
            isroot: 0,
            content: data.contents[i++ % len] + i,
            ouid: ouid,
            ispower: 1,
            status_owner_user: ouid,
            canUploadImage: 0,
            module: 'scommlist',
            root_comment_id: data.cid,
            approvalComment: false,
            location: 'page_100505_single_weibo',
            _t: 0,
        }

        $.ajax({
            url: 'http://weibo.com/aj/v6/comment/add?ajwvr=6&__rnd=' + new Date().getTime(),
            type: 'POST',
            data: _data,
            success: function (res) {
                console.log(res.msg)
            }
        })
    }, 10000)
}
