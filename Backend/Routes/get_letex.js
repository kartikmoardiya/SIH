const express = require('express')
const pdfParse = require('pdf-parse');
const fs = require('fs');
const Pdf = require('../Models/pdf');
const app = express()
const router = express.Router()
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");


async function run(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);

    return result.response.text();
}


router.post('/letex', async (req, res) => {
    try {
        let text = req.body.text + "this is json form convert in text also.give me letx of this bittex text";
        let data = await run(text);
        const mcq = JSON.parse(data);
        res.json(data)

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: "false",
            message: "Server error"
        });
    }
})
module.exports = router