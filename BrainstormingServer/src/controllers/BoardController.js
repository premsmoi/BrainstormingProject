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

module.exports.getBoardList = function(req, res){
  var obj = {}
  Board.find({
    '_id': { $in: req.body.idList}},
    {},
    function(err, boardList){
      if(err)
        res.send(err)
      obj['boardList'] = boardList
      res.send(obj)
      //console.log('boardList: '+JSON.stringify(obj))
    }
  )
}

module.exports.getBoardById = function(boardId, callback){
  //var returnedBoard;
  Board.findById(boardId, callback)
  //console.log('find board: '+board)
  //return returnedBoard;
}

module.exports.updateName = function(req, res){
  Board.update({_id: req.body.boardId}, 
    { $set: {boardName: req.body.boardName}}, 
    function(err, board){
      if(err)
        console.log(err)

  })
}

module.exports.deleteBoard = function(req, res){
  console.log('deleteBoard')
  Board.findById(req.body.boardId).remove(function(err, board){
    
  });
}



exports.list_all_boards = function(req, res) {
  Board.find({}, function(err, board) {
    if (err)
      res.send(err);
    res.json(board);
  });
};
