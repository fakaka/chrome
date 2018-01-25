window.onload = () => {
    var url = window.location.href
    console.log(url)

    if (url.startsWith('http://www.bilibili.com/video/av') || url.startsWith('https://www.bilibili.com/video/av')) {
        // b站
        bilibili()
    } else if (url.startsWith('http://weibo.com')) {
        console.log('weibo')
    }
}
