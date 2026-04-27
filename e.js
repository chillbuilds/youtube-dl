const youtubeDownload = require('youtube-dl-exec')
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.text())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/download-video', (req, res) => {
  fetchVidTitle(req.body)
})

let downloadVideo = (URL, title, channel) => {
    youtubeDownload(URL, {
        output: `/home/will/videos/youtube/${title} - ${channel}.%(ext)s`,
        format: 'bv*+ba/b',
        mergeOutputFormat: 'mp4'
    })
    .then(output => console.log(output))
    .catch(err => console.error(err))
}

async function fetchVidTitle(url) {
  const info = await youtubeDownload(url, {
    dumpSingleJson: true,
    noWarnings: true,
  })

  console.log(info.title)
  console.log(info.uploader)
  downloadVideo(url, info.title, info.uploader)
}

app.listen(port, () => {
  console.log('http://localhost:' + port)
})