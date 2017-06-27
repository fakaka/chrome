window.onload = () => {
    setTimeout(function () {
        var mids = document.getElementsByClassName(' WB_cardwrap WB_feed_type S_bg2')
        for (let i = 0; i < mids.length; i++) {
            let element = mids[i]
            console.log(element.getAttribute('mid'))
            $.ajax({
                url: 'http://weibo.com/aj/mblog/del?ajwvr=6',
                type: 'POST',
                data: { mid: element.getAttribute('mid') }
            })
        }
        setTimeout(function () {
            window.location = window.location
        }, 1000);
    }, 10000);
}