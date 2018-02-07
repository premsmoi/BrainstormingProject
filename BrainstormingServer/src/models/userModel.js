//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    email: String
});

// Compile model from schema
module.exports = mongoose.model('User', userSchema );