function weibo() {
    console.log('weibo')

    console.log(getSingleWeiboImgs())



}

/**
 * 获取单条微博的图片
 * 
 */
function getSingleWeiboImgs() {

    // http://wx1.sinaimg.cn/thumb150/8c4da785ly1fnuzorw0aij21w01w0quw.jpg
    // http://wx1.sinaimg.cn/large/8c4da785ly1fnuzorw0aij21w01w0quw.jpg

    var imgUrls = new Array()
    var imgs = $('.WB_detail .media_box img')
    // console.log(imgs)
    if (imgs) {
        imgs.each(function () {
            let thumbSrc = $(this).attr('src')
            imgUrls.push('https' + thumbSrc.replace('thumb150', 'large'))
        })
    }
    return imgUrls
}

