window.onload = () => {
    var url = window.location.href
    console.log(url)

    if (url.startsWith('http://www.bilibili.com/video/av') || url.startsWith('https://www.bilibili.com/video/av')) {
        bilibili()
    } else if (url.startsWith('https://live.bilibili.com/118')) {
        bilibiliLive()
    } else if (url.startsWith('http://weibo.com') || url.startsWith('https://weibo.com')) {
        weibo()
    } else if (url.startsWith('http://huaban.com/boards/')) {
        huaban()
    } else if (url.startsWith('https://www.pixiv.net/member.php?id=')) {
        pixiv()
    } else if (url.startsWith('https://pan.baidu.com')) {
        baiduyun()
    } else if (url.startsWith('https://www.douyu.com/69964')) {
        douyu()
    }
}
