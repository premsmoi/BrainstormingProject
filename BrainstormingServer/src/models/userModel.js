//Require Mongoose
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs')

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
    	type: String,
    	unique: true,
    	required : true, 
    	dropDups: true
    },
    password: {
    	type: String,
    	required : true, 
    },
    name: {
    	type: String,
    	required : true, 
    },
    email: {
    	type: String,
    	required : true, 
    },
    boards: [{ 
        _id: false,
        boardId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Board',
            unique: true,
            dropDups: true,
        },
        boardName: String,
    }],
});
userSchema.plugin(uniqueValidator);

// Compile model from schema
var User = module.exports = mongoose.model('User', userSchema );

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	})
}