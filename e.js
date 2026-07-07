const youtubeDownload = require('youtube-dl-exec')
const express = require('express')
const path = require('path')
const fs = require('fs')
const { channel } = require('diagnostics_channel')
const dotenv = require('dotenv')
const sanitize = require('sanitize-filename')

dotenv.config()

const downloadDir = '../../storage/shared/Download/youtube/'
// const downloadDir = '/home/will/videos/youtube/'

const app = express()
const port = process.env.PORT || 3000

let downloadQueue = []
let downloading = false
let fileSize

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

let bodySlam = (message, vidObj) => {
  console.log(message)
  console.log(vidObj)
}

app.post('/download-video', (req, res) => {

  console.log(downloadQueue.includes(req.body))

  if(!downloadQueue.some(vid => vid === req.body)){
    downloadQueue.push(req.body)
  }

  console.log(downloadQueue)

  res.send('added to download queue')

})

setInterval(()=>{
  if(downloadQueue.length && downloading == false){
    downloading = true
    fetchVidData(downloadQueue[0].url, downloadQueue[0].quality, downloadQueue[0].format)
  }
  if(downloading){
    // fs.readFileSync()
  }
}, 200)

let downloadVideo = (URL, title, channel, quality, format) => {

    let fileName = sanitize(channel + ' - ' + title)

    if(format == 'mp3'){

      downloadDir = '../../storage/shared/Music/youtube'

      youtubeDownload(URL, {
        output: `${downloadDir}/${fileName}.%(ext)s`,
        extractAudio: true,
        audioFormat: "mp3",
        audioQuality: "0"
      })
      .then(output => {
        console.log(output)
        console.log('download complete')
        downloadQueue.shift()
        downloading = false
      })
      .catch(err => {
        console.log(err)
        downloadQueue.shift()
        downloading = false
      })
    }else if(format == 'mp4'){

      let downloadFormat = 'bv*+ba/b'

      if(quality == 'med'){
        downloadFormat = 'bv*[height<=720]+ba/b[height<=720]'
      }
      if(quality == 'low'){
        downloadFormat = 'bv*[height<=360]+ba/b[height<=360]'
      }

      youtubeDownload(URL, {
        output: `${downloadDir}/${fileName}.%(ext)s`,
        format: format,
        mergeOutputFormat: 'mp4'
      })
      .then(output => {
        console.log(output)
        console.log('download complete')
        downloadQueue.shift()
        downloading = false
      })
      .catch(err => {
        console.log(err)
        downloadQueue.shift()
        downloading = false
      })
    }
}

async function fetchVidData(url, quality, format) {
  try {
    const info = await youtubeDownload(url, {
      dumpSingleJson: true,
      noWarnings: true,
    })

    fileSize = info.filesize_approx
    let fileName = info.uploader + ' - ' + info.title
    
    console.log(`\ndownloading: ${fileName}\n`)

    downloadVideo(url, info.title, info.uploader, quality, format)
  } catch (error) {
    console.log('error downloading video')
  }
}

app.listen(port, () => {
  console.log('http://localhost:' + port)
})