// For Searching
const ytSearch = require('youtube-search-api');
const express = require('express')
const app = express()
const router = express.Router()


// Try for example
// 8c6kE5LKTMI
// https://www.youtube.com/watch?v=roz9sXFkTuE
// https://www.youtube.com/watch?v={AgyTHzjBS-c}

// Real For Individual Video
router.post('/video', async (req, res) => {

    try {
        // let query = req.headers.title;
        let query = req.body.title;
        const results = await ytSearch.GetListByKeyword(query, false, 20); // `query` is the search term, and `10` is the number of results
        // https://www.youtube.com/watch?v={1Z3RrRYIoVs}
        res.json({ data: results.items })

    } catch (error) {
        res.status(200).json({
            Error: "Error Occur"
        })
    }
})
module.exports = router



// const { google } = require('googleapis');
// const youtube = google.youtube('v3');
// const videoIds = ['9kQ1JUDleWg', '9kQ1JUDleWg', '9kQ1JUDleWg', '9kQ1JUDleWg', '9kQ1JUDleWg'];
// const apiKey = "API_KEY"
//         const response = await youtube.videos.list({
//             key: apiKey,
//             part: 'snippet',
//             id: videoIds.join(',')
//         });
//         console.log(results[i].id)
//         response.data.items.forEach((item, index) => {
//             console.log(`Description for video ${index + 1}: ${item.snippet.description}`);
//         });