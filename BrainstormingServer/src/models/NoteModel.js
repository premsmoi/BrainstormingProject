//Require Mongoose
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs')

//Define a schema
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    boardId: {
            type: Schema.Types.ObjectId, 
            ref: 'Board',
            required : true,
    },  
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
    },
});
//userSchema.plugin(uniqueValidator);

// Compile model from schema
var Note = module.exports = mongoose.model('Note', noteSchema );

module.exports.createNote = function(newNote, callback){
    //console.log('noteTest: '+newNote)
    newNote.save(callback);
}