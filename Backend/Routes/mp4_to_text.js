const express = require('express')
const app = express()
const router = express.Router()

const { YoutubeTranscript } = require('youtube-transcript');

router.post('/convert-text', (req, res) => {
    const videoId = req.body.videoId
    let text = ""

    YoutubeTranscript.fetchTranscript(videoId).then(transcript => {
        const data = transcript;

        data.forEach(value => {
            if (value.text) {
                text += value.text;
            }
        });

        // let SummarizerManager = require("node-summarizer").SummarizerManager;

        // let Summarizer = new SummarizerManager(text, 1);
        // res.json({ Summarizer })

        res.json({text})
    });

})


module.exports = router