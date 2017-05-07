window.onload = () => {

    /* 获取昵称 开始 */
    var weibo_nickname = $(".gn_name em").last().text()
    var tieba_nickname = $(".u_username_title").text()
    if (weibo_nickname)
        console.log("微博昵称:" + weibo_nickname)
    if (tieba_nickname)
        console.log("贴吧昵称:" + tieba_nickname)

    chrome.extension.sendMessage({ wname: weibo_nickname, tname: tieba_nickname }, function (response) {
        console.log(response.msg)
    })
    /* 获取昵称 结束 */

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
    
}