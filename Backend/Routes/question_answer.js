const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express')
const app = express()
const router = express.Router()

async function run(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    return result.response.text()
}

router.post('/get-solution', async (req, res) => {
    try {
        let text = req.body.text;
        let answer = await run(text);
        // const jsonObject = JSON.parse(data);
        res.json(answer)

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: "false",
            message: "Server error"
        });
    }
})

module.exports = router
