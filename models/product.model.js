const mongoose = require('mongoose');
const { string } = require('@hapi/joi');

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        min: 6
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        default: 0,
        required: true
    },
    image:{
        type:String,
        required: true
    }

});

module.exports = mongoose.model('Products', productSchema)