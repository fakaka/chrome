var qrcodeDemo = new QRCode(document.getElementById('qrcode'), {
    text: 'http://jindo.dev.naver.com/collie',
    width: 128,
    height: 128,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
})

let enableKeepTwo = localStorage.getItem('enableKeepTwo')
$('#keepTwo').attr('checked', enableKeepTwo == 'true')

$('#keepTwo').change(function(_) {
    localStorage.setItem('enableKeepTwo', $(this).prop('checked'))
})

let enableToolbar = localStorage.getItem('enableToolbar')
$('#toolbar').attr('checked', enableToolbar == 'true')

$('#toolbar').change(function(_) {
    localStorage.setItem('enableToolbar', $(this).prop('checked'))
})
