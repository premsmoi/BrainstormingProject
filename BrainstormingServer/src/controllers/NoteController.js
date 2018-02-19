var mongoose = require('mongoose'),
  	Note = mongoose.model('Note'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

 

exports.create_a_note = function(newNote) {
  
  Note.createNote(newNote, function(err, note){
    if(err){
      console.log(err);
    }
    else{
      console.log('Create Note: '+note);
    }
  })
};

module.exports.getNotes = function(id_arr, callback){
  
  Note.find({
    '_id': { $in: id_arr}},
    {},
    {sort: {updated: 1}}, 
    callback)
  //console.log('find board: '+board)
  //return returnedBoard;
}

module.exports.deleteNoteByBoardId = function(req, res){
  Note.remove(
    {
      boardId: req.body.boardId,
    },
    function(err, note) {
      if (err)
        throw err;
      console.log('delete all notes from boardId: '+req.body.boardId);
    }
  )
}

module.exports.deleteNote = function(id, callback){
  Note.remove({
    _id: id
  }, function(err, note) {
    if (err)
      throw err;
    console.log({ message: 'Note successfully deleted' });
  });
}

exports.list_all_notes = function(req, res) {
  Note.find({}, null, {sort: {updated: 1}}, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
