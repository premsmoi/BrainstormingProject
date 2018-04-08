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
  if (errors) {
    console.log('Error');
    for (i = 0; i < errors.length; i++) {
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
    User.createUser(newUser, function(err, user) {
      if (err) {
        //console.log('Username already exists');
        console.log(err);
        errorMsg.push('Username already exists')
        obj['status'] = 0;
        obj['errors'] = errorMsg;
        res.send(obj);
      } else {
        obj['status'] = 1
        res.send(obj);
        console.log('Register is OK!');
      }
    });
  }
};

exports.get_user = function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err)
      res.send(err)
    console.log('get user !!')
    res.json(user)

    //console.log(user)
  })
}

exports.searchUsers = function(username, callback) {
  var inputJson = {};
  inputJson.username = {
    $regex: username,
    "$options": "i"
  };
  User.find(inputJson, callback)
}

exports.list_all_user = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

module.exports.getUsers = function(username_arr, callback) {

  User.find({
      'username': {
        $in: username_arr
      }
    }, {}, {
      sort: {
        updated: 1
      }
    },
    callback)
}

module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, callback);
}


exports.addBoard = function(obj, callback) {
  console.log('username: ' + obj.username)
  console.log('boardId: ' + obj.boardId)

  var newBoard = {
    boardId: obj.boardId,
    started: 0,
    timeRemaining: 30,
    finished: false,
    votedNotes: [],
  }

  User.update({
    username: obj.username
  }, {
    $push: {
      boards: newBoard
    }
  }, callback)
}

exports.add_board = function(req, res) {

  console.log('username: ' + req.body.username)
  console.log('boardId: ' + req.body.newBoardId)

  var newBoard = {
    boardId: req.body.newBoardId,
    started: 0,
    timeRemaining: 30,
    finished: false,
    votedNotes: [],
  }

  User.update({
      username: req.body.username
    }, {
      $push: {
        boards: newBoard
      }
    },
    function(err, numAffected) {
      res.send(numAffected)
    }
  )
}

exports.deleteBoard = function(obj, callback) {
  User.update({}, {
      $pull: {
        boards: {
          boardId: obj.boardId
        }
      }
    }, {
      multi: true
    },
    callback)
}

exports.enterBoard = function(obj, callback) {
  User.update({
      username: obj.username
    }, {
      $set: {
        currentBoard: obj.boardId
      }
    },
    callback
  )
}

exports.exitBoard = function(username, callback) {
  User.update({
      username: username
    }, {
      $set: {
        currentBoard: null
      }
    },
    callback
  )
}

exports.countTimer = function(username, callback) {
  User.updateMany({}, {
      $inc: {
        'boards.$[elem].timeRemaining': -1
      }
    }, {
      multi: true,
      arrayFilters: [{
        'elem.started': 1,
        'elem.timeRemaining': {
          $gt: 0
        }
      }]
    },
    callback
  )
}

exports.setFinish = function(obj, callback) {
  User.update({
      'boards.timeRemaining': 0
    }, {
      $set: {
        'boards.$.finished': true
      }
    },
    callback
  )
}

exports.startBoard = function(obj, callback) {
  User.update({
    username: obj.username,
    'boards.boardId': obj.boardId
  }, {
    $set: {
      'boards.$.started': 1,
      'boards.$.timeRemaining': obj.setTime,
    }
  }, callback)
}

exports.voteNote = function(obj, callback) {
  User.update({
    username: obj.username,
    'boards.boardId': obj.boardId
  }, {
    $push: {
      'boards.$.votedNotes': obj.votedNoteId,
    }
  }, callback)
}

exports.unvoteNote = function(obj, callback) {
  User.update({
    username: obj.username,
    'boards.boardId': obj.boardId
  }, {
    $pull: {
      'boards.$.votedNotes': obj.unvotedNoteId,
    }
  }, callback)
}
