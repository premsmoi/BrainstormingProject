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
      res.send(board)
  })
}

module.exports.deleteBoard = function(req, res){
  console.log('deleteBoard')
  Board.findById(req.body.boardId).remove(function(err, board){
    res.send(board)
  });
}

module.exports.addMember = function(req, res){
  console.log('addMember')
  console.log('req.body.boardId'+req.body.boardId)
  console.log('req.body.username'+req.body.username)
  Board.update({_id: req.body.boardId},
    { $push: {members: req.body.username}},
    function(err, board){
      if(err)
        console.log(err)
      console.log(board)
      res.send(board)
    }
  )}

module.exports.addNote = function(obj, callback){
  Board.update({_id: obj.boardId},
    { $push: {notes: obj.noteId}},
    callback
  )}

module.exports.deleteNote = function(obj, callback){
  console.log('obj: '+obj)
  Board.update({ _id: obj.boardId}, 
    {
      $pull: { notes: obj.noteId }
    },
    callback
)}

module.exports.addTag = function(req, res){
  console.log('addTag')
  console.log('req.body.boardId'+req.body.boardId)
  console.log('req.body.tag'+req.body.tag)
  Board.update({_id: req.body.boardId},
    { $push: {tags: req.body.tag}},
    function(err, board){
      if(err)
        console.log(err)
      console.log(board)
      res.send(board)
    }
  )}

module.exports.updateNoteList = function(obj, callback){
   Board.update(
    {_id: obj.boardId}, 
    { $set: { notes: obj.newNoteList}},
    callback
  )
}

module.exports.addTag = function(obj, callback){
  Board.update({_id: obj.boardId}, 
              { $push: { tags: obj.tag}},
              callback)
}

module.exports.deleteTag = function(obj, callback){
  Board.update({ _id: obj.boardId}, 
              {
                $pull: { tags: obj.tag }
              }, callback)
}

module.exports.list_all_boards = function(req, res) {
  Board.find({}, function(err, board) {
    if (err)
      res.send(err);
    res.json(board);
  });
};
