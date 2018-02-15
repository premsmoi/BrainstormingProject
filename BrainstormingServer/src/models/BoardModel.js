//Require Mongoose
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs')

//Define a schema
var Schema = mongoose.Schema;

var boardSchema = new Schema({
    boardName: {
    	type: String,
    	//unique: true,
    	required : true, 
    	//dropDups: true
    },
    hasPassword: Boolean,
    password: {
    	type: String,
    },
    members: [String],
    notes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Note',
        //unique: true,
        //dropDups: true,
    }],
});
//userSchema.plugin(uniqueValidator);

// Compile model from schema
var Board = module.exports = mongoose.model('Board', boardSchema );

module.exports.createBoard = function(newBoard, callback){
	console.log('Create Board in Model')
    newBoard.save(callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	})
}