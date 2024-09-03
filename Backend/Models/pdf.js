const mongoose = require('mongoose');


const pdfSchema = new mongoose.Schema({
    // Faculty Email
    faculty_email : {
        type : String
    },
    subject : {
        type : String
    },
    pdf : {
        type : String
    },
    title : {
        type : String,
        required : true
    }
})

const pdfModel = mongoose.model('pdf', pdfSchema);

module.exports = pdfModel;