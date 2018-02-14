var mongoose = require('mongoose'),
  	Board = mongoose.model('Board'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

 

exports.create_a_board = function(req, res) {
  var creator = req.body.creator;
  var boardName = req.body.boardName;
  //var hasPassword = req.body.hasPassword;
  //var password = req.body.password;

  // Validation
  req.checkBody('boardName', 'boardName is required').notEmpty();

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
    var arr = []
    arr.push(creator)
    var newBoard = new Board({
      boardName: boardName,
      members: arr
    });
    Board.createBoard(newBoard, function(err, board){
      if(err){
        //console.log('Username already exists');
        obj['status'] = 0;
        obj['errors'] = errorMsg;
        res.send(obj);
      }
      else{
        obj['newBoardId'] = board._id;
        obj['status'] = 1
        res.send(obj);
        console.log('Create Board!');
      }
    });
  }
};



exports.list_all_boards = function(req, res) {
  Board.find({}, function(err, board) {
    if (err)
      res.send(err);
    res.json(board);
  });
};