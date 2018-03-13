//Require Mongoose
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs')

//Define a schema
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    notificationType: {
    	type: String,
    	required : true, 
    },
    boardName: String,
    boardId: {
        type: Schema.Types.ObjectId, 
        ref: 'Board',
    },
    user: String,
    detail: String,
    read: {
        type: Boolean,
        required: true,
        default: false,
    },
    date: String,
});

// Compile model from schema
var Notification = module.exports = mongoose.model('Notification', notificationSchema );

