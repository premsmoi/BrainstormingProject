//Require Mongoose
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs')

//Define a schema
var Schema = mongoose.Schema;

var notedSchema = new Schema({
    writer: {
            type: String,
            required : true,
    },  
    text: String,
    color: {
        type: String,
        required : true,
    }, 
    x: {
        type: Number,
        required : true,
    }, 
    y: {
        type: Number,
        required : true,
    } 
});
//userSchema.plugin(uniqueValidator);

// Compile model from schema
var Note = module.exports = mongoose.model('Note', noteSchema );
