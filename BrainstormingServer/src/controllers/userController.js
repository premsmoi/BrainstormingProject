var mongoose = require('mongoose'),
  	User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

 

exports.create_a_user = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var name = req.body.name;
  var email = req.body.email;

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

exports.get_user = function(req, res){
  User.findOne({username: req.body.username}, function(err, user){
    if(err)
      res.send(err)
    res.json(user)

    //console.log(user)
  })
}

exports.searchUsers = function(req, res){
  //console.log(req)
  var inputJson={};
  if(req.body.username)inputJson.username={ $regex: req.body.username, "$options": "i" };
  //console.log('req.query.username: '+req.body.username)
  //console.log('inputJson: '+inputJson.username)
  User.find(inputJson, function(err,userList){
    if(err)
      res.send(err)
    res.send(userList)
    //console.log('userList: '+userList)
  })
}

exports.list_all_user = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

module.exports.getUsers = function(username_arr, callback){
  
  User.find({
    'username': { $in: username_arr}},
    {},
    {sort: {updated: 1}}, 
    callback)
}

exports.add_board = function(req, res){
  //var inputJSON = {}
  //inputJSON.username = req.body.username;
  /*User.find(inputJSON, function(err, user){
    if (err)
      res.send(err);
    console.log('user: '+user)
    console.log('boardId: '+req.body.newBoardId)
    var newBoardList = user.boards
    //newBoardList.push(req.body.newBoardId)
    //user.boards = newBoardList
    //user.save()
    console.log('boardList: '+user.boards)
    //newBoardList.push(req.body.newBoardId)
  })*/
  console.log('username: '+req.body.username)
  console.log('boardId: '+req.body.newBoardId)

  var newBoard = {
    boardId: req.body.newBoardId,
  }

  User.update({ username: req.body.username}, 
    {
      $push: { boards: req.body.newBoardId }
    },
    function(err, numAffected){
      res.send(numAffected)
    }
  )
}

exports.delete_board = function(req, res){
  User.update({},
            {
              $pull: { boards: req.body.boardId }
            },
            {multi: true},
            function(err, numAffected){
              console.log('use delete board id :'+req.body.boardId)
              res.send(numAffected)
            })
}

