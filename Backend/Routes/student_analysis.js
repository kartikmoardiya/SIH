const express = require('express');
const router = express.Router();
const app = express();
const Pdf = require('../Models/pdf');
const Dashboard = require('../Models/student_dash')

const convertTimeToMinutes = (timeStr) => {
    return parseInt(timeStr.replace("min", ""), 10);
};

// Helper function to assign a weight to the student level
const getLevelWeight = (level) => {
    switch (level.toLowerCase()) {
        case "beginner":
            return 1;
        case "intermediate":
            return 2;
        case "pro":
            return 3;
        default:
            return 0;
    }
};

const analyzeStudentInterest = (data) => {
    // Extract subject data
    const subjects = data.data;

    // Calculate subject interest scores based on student level and time spent
    const subjectScores = [];
    subjects.forEach((subject) => {
        const subjectName = subject.subject;
        let totalInterestScore = 0;

        subject.chapters.forEach((chapter) => {
            const videoTime = convertTimeToMinutes(chapter.seen_video_time);
            const pdfTime = convertTimeToMinutes(chapter.pdf_read_time);
            const totalTimeSpent = videoTime + pdfTime;

            const levelWeight = getLevelWeight(chapter.student_level);

            // Interest score for this chapter = levelWeight * totalTimeSpent
            totalInterestScore += levelWeight * totalTimeSpent;
        });

        // Add the subject and total interest score to the result
        subjectScores.push({ subject: subjectName, interestScore: totalInterestScore });
    });

    // Sort subjects by total interest score in descending order
    subjectScores.sort((a, b) => b.interestScore - a.interestScore);

    // Prepare the result in the required format
    const sortedSubjectsJson = {
        data: subjectScores.map(({ subject, interestScore }) => ({
            subject,
            interestScore
        }))
    };

    return sortedSubjectsJson;
};

router.post("/all-subject", async (req, res) => {
    try {
        const { id } = req.body;
        let data = await Dashboard.find({ id });

        if (!data) {
            return res.status(404).json({
                success: "false",
                message: "PDF not found in database"
            });
        }
        let inputData = { data }
        const studentData = {
            data: []
        };

        inputData.data.forEach(item => {
            // Check if subject already exists
            let subjectIndex = studentData.data.findIndex(s => s.subject === item.subject);

            if (subjectIndex === -1) {
                // Add new subject if not found
                studentData.data.push({
                    subject: item.subject,
                    chapters: []
                });
                subjectIndex = studentData.data.length - 1;
            }

            // Add chapter under the corresponding subject
            studentData.data[subjectIndex].chapters.push({
                chapter: item.chapter,
                total_video_time: item.total_video_time,
                seen_video_time: item.seen_video_time,
                pdf_read_time: item.pdf_read_time,
                student_level: item.student_level
            });
        });


        const sortedSubjects = analyzeStudentInterest(studentData);
    
        return res.status(200).json({
            data : sortedSubjects.data,
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

router.post("/perticular-topic", async (req, res) => {
    try {
        const { id,subject} = req.body;
        let data = await Dashboard.find({ id,subject });

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