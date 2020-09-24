const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 6
    },
    email: {
        type: String,
        max: 25,
        min: 6
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isAdmin:{
        type: String,
        required: true,
        default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Users', userSchema)