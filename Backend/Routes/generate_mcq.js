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


// let pdfPath = "../files/"
// Event mate
router.post('/generate', async (req, res) => {
    try {
        const { subject } = req.body;
        const pdfTitle = req.body.title;

        const dbpdf = await Pdf.findOne({ title: pdfTitle });

        if (!dbpdf) {
            return res.status(404).json({
                success: "false",
                message: "PDF not found in database"
            });
        }
        const pdfPath = path.join(__dirname, '../files', dbpdf.pdf).trim();


        // Read the PDF file into a buffer
        const dataBuffer = fs.readFileSync(pdfPath);

        // Parse the PDF and extract text
        pdfParse(dataBuffer).then(data => {
            let text = data.text.replace(/\n/g, ' ');
        }).catch(error => {
            console.error('Error extracting PDF content:', error);
        });

        text = req.body.text + "generate 5 mcq from given text with correct answer only json in object form";

        let data = await run(text);
        const mcq = JSON.parse(data);
        res.json(mcq)

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: "false",
            message: "Server error"
        });
    }
})


router.post('/', async (req, res) => {
    try {
        let text = req.body.text + "generate 5 mcq from given text with correct answer only json in object form";
        let data = await run(text);
        const mcq = JSON.parse(data);
        res.json(mcq)

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: "false",
            message: "Server error"
        });
    }
})
module.exports = router