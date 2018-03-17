function douyu() {

    setTimeout(() => {
        $.ajax({
            url: 'https://www.douyu.com/member/prop/query',
            type: 'POST',
            data: { rid: 69964 },
            dataType: "json",
            success: function (res) {
                // console.log(res)
                var list = res.data.list
                for (let i = 0; i < list.length; i++) {
                    const item = list[i]
                    giftSend(item.prop_id, item.count)
                }
            }
        })
    }, 2000);
}

function giftSend(prop_id, count) {

    var data = {
        dy: '48e01e6d9ee0d694307251dc06051501',
        prop_id,
        num: 1,
        sid: 4168448,
        did: 2003187,
        rid: 69964,
        is_jz: 0
    }

    for (let index = 0; index < count; index++) {
        $.post('https://www.douyu.com/member/prop/send', data, function (res) {
            console.log(res.msg)
        })
    }

}
