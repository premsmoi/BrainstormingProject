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
    description: {
        type: String,
        default: '',
    },
    hasPassword: Boolean,
    password: {
    	type: String,
    },
    members: [String],
    facilitator: {
        type: String,
        required: true,
    },
    pendingMembers: [String],
    notes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Note',
        //unique: true,
        //dropDups: true,
    }],
    tags: [String],
    mode: String,
    hasTime: {
        type: Boolean,
        default: false,
    },
    hasGoal: {
        type: Boolean,
        default: false,
    },
    limitedTime: {
        type: Number,
        default: 300,
    },
    goal: {
        type: Number,
        default: 1,
    },
    numberOfVote: {
        type: Number,
        default: 1,
    }
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