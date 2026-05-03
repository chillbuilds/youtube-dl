
$('body').on('keypress', function(event) {
    let enterKey = 13
    if(event.keyCode == enterKey){
        let videoUrl = $('#videoURLInput').val()
        let quality = $('input[name=quality]:checked').attr('quality')

        if(vidCheck(videoUrl)){
            sendDownloadRequest(videoUrl, quality)

            alert('download request sent')
        }
    }
})

let sendDownloadRequest = (videoUrl, quality) => {
    let vidObj = {url: videoUrl, quality: quality}
    fetch('/download-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vidObj)
    })
    .catch(err => console.error(err))
}

let vidCheck = (videoUrl) => {
    let url
    try {
        url = new URL(videoUrl)

        alert((JSON.stringify(url.origin)))

        if(url.origin == 'https://www.youtube.com' && (url.pathname == '/watch' || url.pathname.includes('/shorts')) && !url.search.includes('&list') || url.origin == 'https://youtu.be'){
            return true
        }else if(url.search.includes('&list')){
            alert('playlist download not supported')
            return false
        }else{
            alert('not a valid url')
            return false
        }
    } catch (error) {
        alert('not a valid url')
    }

}