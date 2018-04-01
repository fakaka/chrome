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

    insertToolbar()
}

function insertToolbar() {

    var div_toolbar = document.createElement('div')
    div_toolbar.id = 'hairpin_tools'

    var div_inner =
        `
        <div class="prev_tab"></div>
        <div class="back_to_top">
            <a id="back_to_top">
            ^
            </a>
        </div>
        <div class="next_tab"></div>
        `

    div_toolbar.innerHTML = div_inner
    document.body.appendChild(div_toolbar)

    var toolbar = $('#hairpin_tools')
    // 当滚动条的垂直位置大于浏览器所能看到的页面的那部分的高度时，回到顶部按钮就显示 
    $(window).on('scroll', () => {
        if ($(window).scrollTop() > $(window).height() / 2) {
            toolbar.fadeIn()
        }
        else {
            toolbar.fadeOut()
        }
    })
    $(window).trigger('scroll')

    $('#back_to_top').click(function () {
        $('html,body').animate({
            scrollTop: 0
        }, 800);
    })

}
