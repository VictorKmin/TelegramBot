//This file must be called if user will want to save something

let mongoose = require('mongoose');
let timeZone = require('mongoose-timezone');

let Schema = mongoose.Schema;

// Schema of our model
let task = new Schema({
    // some validate
    chatId: {
        type: String,
        required: true
    },
    dateOfTask: Date,
    description: {
        type: String,
        text: true
    },
    checked: {
        type: Boolean,
        default: false
    }
});
task.plugin(timeZone);
module.exports = mongoose.model('taskModel', task);