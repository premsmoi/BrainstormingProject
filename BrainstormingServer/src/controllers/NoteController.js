var mongoose = require('mongoose'),
  	Note = mongoose.model('Note'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

 

exports.create_a_note = function(note, callback) {
  var newNote = new Note(note)
  Note.createNote(newNote, callback)
};

module.exports.getNotes = function(id_arr, callback){
  //console.log('notes in getNotes: '+id_arr)
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
      res.send('delete all notes from boardId: '+req.body.boardId)
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

module.exports.updateNote = function(updatedObj, callback){
  Note.update(
    {
    _id: updatedObj.id
    }, 
    { 
      $set: updatedObj 
    },
    callback
  )
}

exports.list_all_notes = function(req, res) {
  Note.find({}, null, {sort: {updated: 1}}, function(err, note) {
    if (err)
      res.send(err);
    res.json(note);
  });
};
