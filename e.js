const youtubeDownload = require('youtube-dl-exec')
const express = require('express')
const path = require('path')
const fs = require('fs')
const { channel } = require('diagnostics_channel')

const app = express()
const port = process.env.PORT || 3000

let downloadQueue = []
let downloading = false

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.text())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/download-video', (req, res) => {

  downloadQueue.push(req.body)

  console.log(downloadQueue)

})

setInterval(()=>{
  if(downloadQueue.length && downloading == false){
    downloading = true
    fetchVidData(downloadQueue[0])
  }
}, 1000)

let downloadVideo = (URL, title, channel) => {
    youtubeDownload(URL, {
        output: `/home/will/videos/youtube/${title} - ${channel}.%(ext)s`,
        format: 'bv*+ba/b',
        mergeOutputFormat: 'mp4'
    })
    .then(output => {
      console.log(output)
      console.log('download complete')
      downloadQueue.shift()
      downloading = false
    })
    .catch(err => console.error(err))
}

async function fetchVidData(url) {
  try {
    const info = await youtubeDownload(url, {
      dumpSingleJson: true,
      noWarnings: true,
    })

    console.log(`\ndownloading: ${info.title} - ${info.uploader}\n`)
    downloadVideo(url, info.title, info.uploader)
  } catch (error) {
    console.log('error downloading video')
  }
}

app.listen(port, () => {
  console.log('http://localhost:' + port)
})