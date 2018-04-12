var mongoose = require('mongoose'),
  	Notification = mongoose.model('Notification'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

 

module.exports.createNotification = function(obj, callback) {
  var newNotification = new Notification(obj.newNoti)
  obj.users.map(function(user){
    newNotification.user = user
    newNotification.save(callback)
  })
};

module.exports.getNotification = function(obj, callback){
  //console.log('notes in getNotes: '+id_arr)
  Notification.find({
    'user': obj.username},
    {},
    {sort: {date: -1}}, 
    callback)
  //console.log('find board: '+board)
  //return returnedBoard;
}

module.exports.getAllNotification = function(req, res){
  //console.log('notes in getNotes: '+id_arr)
  Notification.find({},
    {},
    function(err, notifications){
      if(err)
        res.send(err)
      res.send(notifications)
    })
  //console.log('find board: '+board)
  //return returnedBoard;
}


module.exports.deleteNotification = function(obj, callback){
  Note.remove({
    _id: obj.id
  }, callback)
}

module.exports.updateNotification = function(obj, callback){
  Notification.update(
    {
    _id:obj.id
    }, 
    { 
      $set: obj.updatedObj 
    },
    callback
  )
}
