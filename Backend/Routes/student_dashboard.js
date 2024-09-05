const express = require('express');
const router = express.Router();
const app = express();
const Pdf = require('../Models/pdf');
const Dashboard = require('../Models/student_dash')

router.post("/post-growth", async (req, res) => {
    try {
        const { id, chapter, student_level, subject, faculty_email, total_video_time, seen_video_time, pdf_read_time, video_link } = req.body;

        const db = await Dashboard.findOne({ chapter, subject, id });
        const pdf = await Pdf.findOne({ title: chapter });
        if (db) {
            await Dashboard.updateOne(
                { id, subject, chapter },
                { $set: { student_level: student_level, total_video_time, seen_video_time, pdf_read_time, video_link } }
            )

            return res.status(200).json({
                message: "PDF Updated successfully",
                success: true,
            });
        }

        const data = new Dashboard({
            pdf_read_time,
            seen_video_time,
            total_video_time,
            subject,
            chapter,
            student_level,
            id,
            faculty_email,
            video_link
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


router.post("/get-growth", async (req, res) => {
    try {
        const { id, subject } = req.body;
        const data = await Dashboard.find({ id, subject });
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


router.post("/get-subject-detail", async (req, res) => {
    try {
        const { subject } = req.body;
        const data = await Pdf.find({ subject });

        if (!data) {
            return res.status(404).json({
                success: "false",
                message: "PDF not found in database"
            });
        }

        return res.status(200).json({
            data ,
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