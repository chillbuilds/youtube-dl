
$('body').on('keypress', function(event) {
    let enterKey = 13
    if(event.keyCode == enterKey){
        let videoUrl = $('#videoURLInput').val()

        if(vidCheck(videoUrl)){
            sendDownloadRequest(videoUrl)

            console.log('download request sent')
        }
    }
})

let sendDownloadRequest = (videoUrl) => {
    fetch('/download-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: videoUrl
    })
    .catch(err => console.error(err))
}

let vidCheck = (videoUrl) => {
    let url
    try {
        url = new URL(videoUrl)

        if(url.origin == 'https://www.youtube.com' && (url.pathname == '/watch' || url.pathname.includes('/shorts')) && !url.search.includes('&list')){
            return true
        }else if(url.search.includes('&list')){
            console.log('playlist download not supported')
            return false
        }else{
            console.log('not a valid url')
            return false
        }
    } catch (error) {
        console.log('not a valid url')
    }

}