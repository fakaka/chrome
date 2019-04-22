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
    console.log($(this))
    localStorage.setItem('enableKeepTwo', $(this).prop('checked'))
})
