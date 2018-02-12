var mongoose = require('mongoose'),
  	User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

 

exports.create_a_user = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var name = req.body.name;
  var email = req.body.name;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  var obj = {}
  var errorMsg = []
  if(errors){
    console.log('Error');
    for(i=0;i<errors.length;i++){
      errorMsg.push(errors[i]['msg'])
    }
    obj['status'] = 0;
    obj['errors'] = errorMsg;
    res.send(obj)
  } else {
    var newUser = new User({
      username: username,
      password: password,
      name: name,
      email: email,
    });
    User.createUser(newUser, function(err, user){
      if(err){
        console.log('Username already exists');
        errorMsg.push('Username already exists')
        obj['status'] = 0;
        obj['errors'] = errorMsg;
        res.send(obj);
      }
      else{
        obj['status'] = 1
        res.send(obj);
        console.log('Register is OK!');
      }
    });
  }
};


exports.list_all_user = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};