const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    correct_answer : {
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
    growth : {
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
    }
})

const pdfModel = mongoose.model('student_dashboard', studentSchema);

module.exports = pdfModel;