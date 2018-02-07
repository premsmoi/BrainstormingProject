var mongoose = require('mongoose'),
  	User = mongoose.model('User');

exports.create_a_user = function(req, res) {
  //req = {username: "aaaaa", password: "aaaaa"};
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};



exports.check_login = function(req, res) {
  //User.findById(req.params.username, function(err, user) {
    console.log(req.body);
    User.count({ username: req.body.username, password: req.body.password }, function(err, status){
    if (err)
      res.send(err);
    var obj = {};
    if(status==1)
      obj['loginStatus'] = 1;
    else 
      obj['loginStatus'] = 0;
    res.json(obj);
    console.log(res);
  });
};

exports.list_all_user = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};