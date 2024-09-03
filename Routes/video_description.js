const express = require('express')
const app = express()
const router = express.Router()




// Modules For Get Description
const { google } = require('googleapis');
const youtube = google.youtube('v3');
router.post('/description', async (req, res) => {
    try {
        // console.log(req.headers.ids)
        const videoIds = req.body.ids;
        const apiKey = process.env.YOUTUBE_DATA_API;
        const response = await youtube.videos.list({
            key: apiKey,
            part: 'snippet',
            id: videoIds.join(',')
        });

        let description = ""
        response.data.items.forEach((item, index) => {
            description += item.snippet.description;
        });

        // Extract URLs from the example description
        let urls = extractUrls(description);
        urls = iterateCharacters(urls);

        urls = seprateUrls(urls);
        res.json(urls)
    } catch (error) {
        res.status(200).json({
            Error: "Error Occur"
        })
    }

})

// Function to extract URLs from text
function extractUrls(text) {
    const urlPattern = /https?:\/\/[^\s]+/g;
    return text.match(urlPattern) || [];
}

// Remove Unnecessarylink
// Function to iterate over each character of URLs
function iterateCharacters(urls) {
    const substringsToCheck = [
        'www.instagram.com',
        'twitter.com',
        'linkedin.com',
        'discord.com',
        'amzn.to'
    ];

    // Step 1: Collect indices of URLs to be removed
    const indicesToRemove = [];
    urls.forEach((url, index) => {
        // Check if the URL contains any of the substrings
        for (const substring of substringsToCheck) {
            if (url.includes(substring)) {
                indicesToRemove.push(index);
                break;
            }
        }
    });

    // Step 2: Remove elements based on collected indices (in reverse to avoid index shift)
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        urls.splice(indicesToRemove[i], 1);
    }

    return urls;
}




function seprateUrls(uurls) {

    let ccategories = {
        pdf: new Set(),
        drive: new Set(),
        instagram: new Set(),
        docs: new Set(),
        twitter: new Set(),
        github: new Set(),
        others: new Set()
    };

    let patterns = {
        pdf: /\.pdf$/,
        drive: /drive\.google\.com/,
        instagram: /instagram\.com/,
        docs: /docs\.google\.com/,
        twitter: /twitter\.com/,
        github: /github\.com/
    };

    uurls.forEach(uurl => {
        let ccategorized = false;

        for (let [ccategory, pattern] of Object.entries(patterns)) {
            if (pattern.test(uurl)) {
                ccategories[ccategory].add(uurl);
                ccategorized = true;
                break;
            }
        }

        if (!ccategorized) {
            ccategories.others.add(uurl);
        }
    });

    // Convert Sets back to arrays if needed
    for (let category in ccategories) {
        ccategories[category] = Array.from(ccategories[category]);
    }

    return ccategories;
}
module.exports = router