function baiduyun() {
    console.log('baiduyun')

    pastePassword()

}

function pastePassword() {
    var element = document.getElementById('fmdJvd')
    if (document.execCommand) {
        if (element.setSelectionRange) {
            element.focus();
            element.setSelectionRange(element.value.length, element.value.length);
        }
        else if (element.createTextRange) {
            var range = element.createTextRange();
            range.collapse(true);
            range.moveEnd('character', element.value.length);
            range.moveStart('character', element.value.length);
            range.select();
        }
        document.execCommand('paste');
    }
    if (element.value.length != 4) {
        element.value = ''
    }
}
