
$('body').on('keypress', function(event) {
    let enterKey = 13
    if(event.keyCode == enterKey){
        let videoUrl = $('#videoURLInput').val()
        let quality = $('input[name=quality]:checked').attr('quality')

        sendDownloadRequest(videoUrl, quality)

    }
})

$('#clearIcon').on('click', () => {
    $('#videoURLInput').val('')
})

let sendDownloadRequest = (videoUrl, quality) => {
    let vidObj = {url: videoUrl, quality: quality}
    fetch('/download-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vidObj)
    }).then(res => res.text())
    .then(text => {
        console.log(text); // "Download started"
    })
    .catch(err => console.error(err))
}