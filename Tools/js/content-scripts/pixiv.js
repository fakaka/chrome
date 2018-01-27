function pixiv() {
    console.log('pixiv')

    // https://i.pximg.net/c/600x1200_90/img-master/img/2017/12/27/02/50/05/66478144_p0_master1200.jpg
    // https://i.pximg.net/img-original/img/2017/12/27/02/50/05/66478144_p0.png 
    var imgUrls = new Array()
    var imgs = $('.ui-brick img')
    console.log(imgs)
    if (imgs) {
        imgs.each(function () {
            let thumbSrc = $(this).attr('src')
            imgUrls.push('http' + thumbSrc.replace('_fw236', ''))
        })
    }

    console.log(imgUrls)
}
