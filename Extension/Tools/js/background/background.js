var mids = document.getElementsByClassName(' WB_cardwrap WB_feed_type S_bg2')
for (var i = 0; i < mids.length; i++) {
    var element = mids[i]
    console.log(element.getAttribute('mid'))

    var req = new XMLHttpRequest()
    req.open('POST','http://weibo.com/aj/mblog/del?ajwvr=6')
    req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    req.send('mid='+element.getAttribute('mid'))
}



