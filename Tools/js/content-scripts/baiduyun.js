function baiduyun() {
    console.log('baiduyun')

    pastePassword()
}

function pastePassword() {
    var element = document.getElementsByTagName('input')[0]
    if (!element) {
        return
    }
    if (document.execCommand) {
        if (element.setSelectionRange) {
            element.focus()
            element.setSelectionRange(element.value.length, element.value.length)
        } else if (element.createTextRange) {
            var range = element.createTextRange()
            range.collapse(true)
            range.moveEnd('character', element.value.length)
            range.moveStart('character', element.value.length)
            range.select()
        }
        document.execCommand('paste')
    }
    if (element.value.trim().length != 4) {
        element.value = ''
    } else {
        setTimeout(() => pastePassword, 1000)
    }
}
