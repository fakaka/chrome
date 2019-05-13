window.onload = () => {
    var url = window.location.href
    console.log(url)

    if (
        url.startsWith('http://www.bilibili.com/video/av') ||
        url.startsWith('https://www.bilibili.com/video/av')
    ) {
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

    if (
        $('body').width() > 800 &&
        !url.startsWith('http://localhost') &&
        !url.startsWith('file:///')
    ) {
        // 获取是否开启工具按钮
        insertToolbar()
    }
}

function insertToolbar() {
    var div_toolbar = document.createElement('div')
    div_toolbar.id = 'hairpin_tools'

    var div_inner = `
        <div class="back_to_top" title="回到顶部">
            <span>^</span>
        </div>
        <div class="prev_tab" title="上一个标签页">
            <span><</span>
        </div>
        <div class="next_tab" title="下一个标签页">
            <span>></span>
        </div>
        <div class="hp_close" title="关闭或隐藏">
            <span>x</span>
        </div>
        `

    div_toolbar.innerHTML = div_inner
    document.body.appendChild(div_toolbar)

    // 当滚动条的垂直位置大于浏览器所能看到的页面的那部分的高度时，回到顶部按钮就显示
    var backToTop = $('.back_to_top')
    backToTop.hide()
    $(window).on('scroll', () => {
        if ($(window).scrollTop() > $(window).height() / 2) {
            backToTop.fadeIn()
        } else {
            backToTop.fadeOut()
        }
    })
    $(window).trigger('scroll')

    backToTop.click(function() {
        $('html,body').animate(
            {
                scrollTop: 0
            },
            800
        )
    })

    // 前一个标签页
    $('.prev_tab').click(function() {
        sendMessage('tab', { action: 'prev' })
    })

    // 后一个标签页
    $('.next_tab').click(function() {
        sendMessage('tab', { action: 'next' })
    })
    $('#hairpin_tools .hp_close').click(function() {
        // $('.back_to_top').toggle()
        $('.prev_tab').toggle(200)
        $('.next_tab').toggle(200)
    })

    $('#hairpin_tools .hp_close').dblclick(function() {
        $('#hairpin_tools').hide()
    })
}

function sendMessage(name, data) {
    var request = {
        name,
        data
    }
    chrome.extension.sendMessage(request, function(response) {
        if (response) {
            // console.log(response)
        }
    })
}

function notify(data) {
    sendMessage('notify', data)
}
