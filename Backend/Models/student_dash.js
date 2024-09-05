const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    student_level : {
        type : String
    },
    chapter : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    faculty_email : {
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true
    },
    total_video_time : {
        type : String,
        required : true
    },
    seen_video_time : {
        type : String,
        required : true
    },
    pdf_read_time : {
        type : String,
        required : true
    }
})

const pdfModel = mongoose.model('student_dashboard', studentSchema);

module.exports = pdfModel;