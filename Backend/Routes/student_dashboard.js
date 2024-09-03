const express = require('express');
const router = express.Router();
const app = express();
const Pdf = require('../Models/pdf');
const Dashboard = require('../Models/student_dash')

router.post("/post-growth", async (req, res) => {
    try {
        const { id, chapter, correct_answer, subject, faculty_email } = req.body;

        const db = await Dashboard.findOne({ chapter,subject,id});
        const pdf = await Pdf.findOne({ title : chapter});
        if (db) {
            await Dashboard.updateOne(
                { id, subject, chapter },
                { $set: { correct_answer: correct_answer, growth : correct_answer*10 } }
            )

            return res.status(200).json({
                message: "PDF Updated successfully",
                success: true,
            });
        }

        let growth = (correct_answer * 100) / 10;
        const data = new Dashboard({
            correct_answer,
            chapter,
            subject,
            growth,
            id,
            faculty_email : pdf.faculty_email
        })

        await data.save();
        return res.status(200).json({
            message: "PDF added successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: "false",
            message: "Server error"
        });
    }
});


router.get("/get-growth", async (req, res) => {
    try {
        const { id,subject} = req.body;
        const data = await Dashboard.findOne({ id, subject });
        if (!data) {
            return res.status(404).json({
                success: "false",
                message: "PDF not found in database"
            });
        }

        return res.status(200).json({
            data,
            message: "PDF added successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: "false",
            message: "Server error"
        });
    }
});
module.exports = router;