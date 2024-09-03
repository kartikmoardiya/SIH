const express = require('express');
const router = express.Router();
const app = express();
const Pdf = require('../Models/pdf');
const Dashboard = require('../Models/student_dash')

router.post("/get-growth", async (req, res) => {
    try {
        const { _id, title, correct_answer, subject } = req.body;

        const dbpdf = await Pdf.findOne({ title });
        console.log(dbpdf);
        if (!dbpdf) {
            return res.status(404).json({
                success: "false",
                message: "PDF not found in database"
            });
        }

        let growth = (correct_answer * 100) / 10;
        const data = new Dashboard({
            correct_answer,
            chapter: title,
            subject,
            growth,
            _id,
            faculty_email: dbpdf.faculty_email
        })
        try {
            await data.save();
            return res.status(200).json({
                message: "PDF added successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal server error",
                success: false,
            });
        }
        res.send({ status: "ok" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: "false",
            message: "Server error"
        });
    }
});

module.exports = router;