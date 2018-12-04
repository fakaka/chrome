// http://huaban.com/pins/116992685/
function huaban(params) {
    console.log('huaban')

    var imgUrls= new Array()
    var imgs = $('#waterfall a.layer-view img')
    // console.log(imgs)
    if (imgs) {
        imgs.each(function () {
            let thumbSrc = $(this).attr('src')
            imgUrls.push(thumbSrc.replace('_fw236', ''))
        })
    }

    console.log(imgUrls)
}
