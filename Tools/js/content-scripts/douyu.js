function douyu() {

    console.log('22222222222')
    $.ajax({
        url: 'https://www.douyu.com/member/prop/query',
        type: 'POST',
        data: { rid: 69964 },
        dataType: "json",
        success: function (res) {
            console.log(res)
            if (res.code == 0) {
                var list = res.data.list
                console.log(list)
                for (let i = 0; i < list.length; i++) {
                    const item = list[i]
                    giftSend(item.prop_id, item.count)
                }
            }
        }
    })
}

function giftSend(prop_id, count) {

    // prop_id = 23 & num=1 &  &

    var data = {
        prop_id,
        num: 1,
        sid: 4168448,
        gift_num,
        did: 2003187,
        rid: 69964
    }
    console.log(data)

    // $.ajax({
    //     url: 'https://api.live.bilibili.com/gift/v2/live/bag_send',
    //     type: 'POST',
    //     data: data,
    //     dataType: "json",
    //     success: function (res) {
    //         console.log(res.msg)
    //     }
    // })
}
