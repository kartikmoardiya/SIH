const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    link : {
        type : String,
        required : true
    },
    gen_link : {
        type : String,
        required : true
    },
})

const dataModel = mongoose.model('data', dataSchema);

module.exports = dataModel;