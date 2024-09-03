const mongoose = require('mongoose');


const pdfSchema = new mongoose.Schema({
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