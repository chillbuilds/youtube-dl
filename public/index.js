
$('body').on('keypress', function(event) {
    let enterKey = 13
    if(event.keyCode == enterKey){

        let videoUrl = $('#videoURLInput').val()
        let format = $('input[name=mediaType]:checked').attr('mediaType')
        let quality = $('input[name=quality]:checked').attr('quality')

        sendDownloadRequest(videoUrl, format, quality)

    }
})

$('#clearIcon').on('click', () => {
    $('#videoURLInput').val('')
})

let sendDownloadRequest = (videoUrl, format, quality) => {
    let vidObj = {url: videoUrl, format: format, quality: quality}
    fetch('/download-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vidObj)
    }).then(res => res.text())
    .then(text => {
        $('#notification').text(text)
        setTimeout(() => {
            $('#notification').text('')
        }, 2000)
    })
    .catch(err => console.error(err))
}