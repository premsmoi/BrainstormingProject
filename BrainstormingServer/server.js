var express = require('express'),
    app = express(),
    http = require('http').Server(app);
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    User = require('./src/models/UserModel'),
    Board = require('./src/models/BoardModel'),
    Note = require('./src/models/NoteModel'),
    Notification = require('./src/models/NotificationModel')
    boardList = require('./src/controllers/BoardController'),
    noteList = require('./src/controllers/NoteController'),
    userList = require('./src/controllers/UserController'),
    notificationList = require('./src/controllers/NotificationController'),
    WebSocket = require('ws'),
    validator = require('express-validator'),
    passport = require('passport'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    util = require('util'),
    async = require('async'),
    includes = require('array-includes'),
    sleep = require('sleep'),
    dateFormat = require('dateformat');




mongoose.connect('mongodb://localhost/Brainstorming');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Database connnected!");
});

// Init App


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(validator());

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

var routes = require('./src/routes/UserRoutes');
routes(app);
var routes = require('./src/routes/BoardRoutes');
routes(app);
var routes = require('./src/routes/NoteRoutes');
routes(app);
var routes = require('./src/routes/NotificationRoutes');
routes(app);

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('INDEX');
})

// This responds a POST request for the homepage
app.post('/post', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})

var server = app.listen(8080, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})

var wsServer = new WebSocket.Server({server})

/*wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});*/

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connectionList = []


wsServer.on('connection', function connection(connection, request) {
    
    connection.on('message', function incomiing(message) {
        var obj = JSON.parse(message)  
       
        /*
          ########## HOME ##########
        */
        if(obj.from == 'Home'){


          if(obj.code == 'tagUser'){
            connection['username'] = obj.username
            connection['from'] = obj.from
            var cc = util.inspect(connection)
            console.log('Client: '+connection['username'] + ' connect to server')
          }

          else if(obj.code == 'getBoardList'){
            console.log(obj)
            boardList.getBoardList(obj.board_id_list, function(err, boards){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getBoardList', boards: boards} });
              connection.send(json);
            })
          }

          else if(obj.code == 'getUser'){
            console.log(obj)
            userList.getUserByUsername(obj.username, function(err, user){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getUser', user: user} });
              connection.send(json);
            })
          }

          else if(obj.code == 'acceptInvite'){
            console.log(obj)
            userList.addBoard({username: obj.username, boardId: obj.boardId}, function(err, numAffected){
              if(err)
                console.log(err)
              userList.getUserByUsername(obj.username, function(err, user){
                if(err)
                  console.log(err)
                var json = JSON.stringify({ body: {code: 'getUser', user: user}})
                 wsServer.clients.forEach(function each(client) {
                      if(client['username'] == obj.username){
                        console.log('send get user to username: '+obj.username)
                        client.send(json)
                      }
                    });
              })
              boardList.getBoardById(obj.boardId, function(err, board){
                boardList.addMember({username: obj.username, boardId: obj.boardId}, function(err, numAffected){
                  if(err)
                    console.log(err)
                  
                    userList.getUsers(board.members, function(err, users){
                      if(err)
                        console.log(err)
                      var user_arr = []
                      users.forEach(function(user){
                        user_arr.push({username: user.username, name: user.name, currentBoard: user.currentBoard})
                      })
                      var json = JSON.stringify({ body: {code: 'getMembers', members: user_arr}})
                      var json2 = JSON.stringify({ body: {code: 'getBoardListTrigger'} });
                      //connection.send(json)
                      console.log('json: '+json)
                      wsServer.clients.forEach(function each(client) {
                        if(client['boardId'] == connection['boardId']){
                          client.send(json)
                        }
                        if(client['username'] == obj.username){
                          client.send(json2)
                        }
                    });
                  })
                })
              })
                
            })
          }

          else if(obj.code == 'deleteBoard'){
            console.log(obj)
            var res_users = []
            boardList.getBoardById(obj.boardId, function(err, board){
              if(err)
                console.log(err)
              res_users = board.members
              boardList.deleteBoard({boardId: obj.boardId}, function(err, removed){
                if(err)
                  console.log(err)
                userList.deleteBoard({boardId: obj.boardId}, function(err, numAffected){
                  if(err)
                    console.log(err)

                  var json = JSON.stringify({ body: {code: 'getBoardListTrigger'} });
                  wsServer.clients.forEach(function each(client) {
                    if(includes(res_users, client['username']) && client['from'] == 'Home'){
                      client.send(json)
                    }
                  });
                })
               
              }) 
            })
          }

          else if(obj.code == 'getNotification'){
            console.log(obj)
            notificationList.getNotification({username: obj.username}, function(err, notifications){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getNotification', notifications: notifications} });
              connection.send(json);
              console.log(json)
            })
          }

          else if(obj.code == 'readNotification'){
            console.log(obj)
            notificationList.updateNotification({id: obj.id, updatedObj : {read: true}}, function(err, numAffected){
              if(err)
                console.log(err)
              notificationList.getNotification({username: obj.username}, function(err, notifications){
                if(err)
                  console.log(err)
                var json = JSON.stringify({ body: {code: 'getNotification', notifications: notifications} });
                connection.send(json);
                console.log(json)
              })
            })
          }
        }

        if(obj.from == 'Board'){
          if(obj.code == 'tagBoard'){
            connection['boardId'] = obj.boardId
            connection['username'] = obj.username
            connection['from'] = obj.from
            var cc = util.inspect(connection)
            console.log('Client: '+connection['username'] + ' connect board: '+connection['boardId'])
          }

          else if(obj.code == 'createNote'){
            console.log('in creteNote')
            noteList.create_a_note(obj.note, function(err, note){
              var newNote = {
                boardId: obj.note.boardId,
                noteId: note._id,
              }
              boardList.addNote(newNote, function(err, numAffected){
                boardList.getBoardById(note.boardId, function(err, board){
                  if(err)
                    console.log(err)
                  noteList.getNotes(board.notes, function(err, notes){
                    if(err)
                      console.log(err)
                    console.log('notes: '+notes)
                    var json = JSON.stringify({ body: {code: 'updatedNotes', notes: notes} });
                    wsServer.clients.forEach(function each(client) {
                      if(client['boardId'] == connection['boardId'] && client['from'] == 'Board'){
                        sleep.msleep(100)
                        client.send(json)
                      }
                    });
                    var now = new Date()
                    var newNoti = {
                      notificationType: 'normal',
                      boardId: board._id,
                      boardName: board.boardName,
                      user: obj.note.writer,
                      detail: 'There is a new note in board: '+board.boardName,
                      date: dateFormat(now, 'd mmmm yyyy HH:MM')
                    }
                    var to_users = []
                    board.members.map(function(member){
                      if(member != note.writer){
                        to_users.push(member)
                      }
                    })
                    notificationList.createNotification({newNoti: newNoti, users: to_users}, function(err, noti){
                      if(err)
                        console.log(err)
                      var json = JSON.stringify({ body: {code: 'getNotificationt', notification: noti}});
                      wsServer.clients.forEach(function each(client) {
                        if(includes(board.members, client['username']) && client['from'] == 'Home' && client['username'] != note.writer){
                          client.send(json)
                        }
                      });
                    })
                  })
                })
              })
            });    
          }

          else if(obj.code == 'getNotes'){
            boardList.getBoardById(obj.boardId, function(err, board){
              if(err)
                console.log(err)
              noteList.getNotes(board.notes, function(err, notes){
                if(err)
                  console.log(err)
                var json = JSON.stringify({ body: {code: 'updatedNotes', notes: notes} });
                sleep.msleep(100)
                connection.send(json);
              })
            })
          }

          else if(obj.code == 'deleteNote'){
            noteList.deleteNote(obj.noteId, function(err, note){
              if(err)
                console.log(err)
            })

            boardList.deleteNote({boardId: obj.boardId, noteId: obj.noteId}, function(err, numAffected){
                var json = JSON.stringify({ body: {code: 'getNotes'}})
                wsServer.clients.forEach(function each(client) {
                  if(client['boardId'] == connection['boardId'] && client['from'] == 'Board'){
                    client.send(json)
                  }
                });
              })

          }

          else if(obj.code == 'updateNote'){
            console.log(obj)
            noteList.updateNote(obj.updatedObj, function(err, note){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getNotes'}})
              wsServer.clients.forEach(function each(client) {
                if(client['boardId'] == connection['boardId'] && client['from'] == 'Board'){
                  client.send(json)
                }
              });
            })
          }

          else if(obj.code == 'updateNoteList'){
            console.log(obj)
            boardList.updateNoteList({boardId: obj.boardId, newNoteList: obj.newNoteList}, function(err, board){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getNotes'}})
              wsServer.clients.forEach(function each(client) {
                if(client['boardId'] == connection['boardId'] && client['from'] == 'Board'){
                  client.send(json)
                }
              });
            })
          }


          else if(obj.code == 'enterBoard'){
            console.log(obj)
            userList.enterBoard({username: obj.username, boardId: obj.boardId}, function(err, numAffected){
              if(err)
                console.log(err)
              boardList.getBoardById(obj.boardId, function(err, board){
                  userList.getUsers(board.members, function(err, users){
                    if(err)
                      console.log(err)
                    var user_arr = []
                    users.forEach(function(user){
                      user_arr.push({username: user.username, name: user.name, currentBoard: user.currentBoard})
                    })
                    var json = JSON.stringify({ body: {code: 'getMembers', members: user_arr}})
                    connection.send(json)
                    console.log('json: '+json)
                    wsServer.clients.forEach(function each(client) {
                      if(client['boardId'] == connection['boardId']){
                        client.send(json)
                        //console.log('sent json:'+json)
                      }
                    });
                    })
                })
            })
          }

          else if(obj.code == 'exitBoard'){
            console.log(obj)
            userList.exitBoard(obj.username, function(err, numAffected){
              if(err)
                console.log(err)
              boardList.getBoardById(obj.boardId, function(err, board){
                  userList.getUsers(board.members, function(err, users){
                    if(err)
                      console.log(err)
                    var user_arr = []
                    users.forEach(function(user){
                      user_arr.push({username: user.username, name: user.name, currentBoard: user.currentBoard})
                    })
                    var json = JSON.stringify({ body: {code: 'getMembers', members: user_arr}})
                    //connection.send(json)
                    console.log('json: '+json)
                    wsServer.clients.forEach(function each(client) {
                      if(client['boardId'] == connection['boardId'] && client.readyState === WebSocket.OPEN){
                        client.send(json)
                        //console.log('sent json:'+json)
                      }
                    });
                    var json = JSON.stringify({ body: {code: 'closeWebSocket',}})
                    connection.send(json)
                    })
                })
            })
          }

           else if(obj.code == 'startBoard'){
            console.log(obj)
            userList.startBoard({username: obj.username, boardId: obj.boardId}, function(err, numAffected){
              if(err)
                console.log(err)
              console.log('numAffected: '+JSON.stringify(numAffected))
            })
          }

          else if(obj.code == 'getBoardStartStatus'){
            console.log(obj)
            userList.getUserByUsername(obj.username, function(err, user){
              if(err)
                console.log(err)
              //console.log('board: '+JSON.stringify(user.boards))
              user.boards.forEach(function(board){
                //console.log('board: '+JSON.stringify(board))
                if(board.boardId == obj.boardId){
                  //console.log('Match!')
                  var json = JSON.stringify({ body: {code: 'getBoardStartStatus', status: board.started}})
                  connection.send(json)
                  console.log(json)
                }
              })
              
            })
          }

          else if(obj.code == 'boardGetTimer'){
            console.log(obj)
            userList.getUserByUsername(obj.username, function(err, user){
              if(err)
                console.log(err)
              user.boards.forEach(function(board){
                if(board.boardId == obj.boardId){
                  var json = JSON.stringify({ body: {code: 'getTimer', timeRemaining: board.timeRemaining}})
                  connection.send(json)
                  console.log(json)
                }
              })
              
            })
          }

          else if(obj.code == 'searchUser'){
            console.log(obj)
            userList.searchUsers(obj.username, function(err, users){
              if(err)
                console.log(err)
              var user_arr = []
              var itemsProcessed = 0;
              async.forEachOf(users, function (user, key, callback) {
                boardList.findBoard({'_id': obj.boardId, 'members': user.username}, function(err, boards){
                  if (err) 
                    return callback(err);
                  if(boards.length == 0){
                    user_arr.push({username: user.username, joined: false})
                  }
                  else{
                    user_arr.push({username: user.username, joined: true})
                  }
                  console.log('boards length: '+boards.length)
                  itemsProcessed++;
                  if(itemsProcessed == users.length){
                    console.log('user_arr: '+user_arr)
                    var json = JSON.stringify({ body: {code: 'getUserSearchResult', userList: user_arr}})
                    connection.send(json)
                  }
                  callback()
                })
              }, function (err) {
                if (err) console.error(err.message);
              })
              /*users.forEach(function each(user){
                boardList.findBoard({'_id': obj.boardId, 'members': user.username}, function(err, boards){
                  if(err)
                    console.log(err)
                  if(boards.length == 0){
                    user_arr.push({username: user.username, joined: 0})
                  }
                  else{
                    user_arr.push({username: user.username, joined: 1})
                  }
                  console.log('boards length: '+boards.length)
                  user_arr.push(1)
                })*/
            })
          }

          else if(obj.code == 'inviteUser'){
            console.log(obj)
            userList.addBoard({username: obj.username, boardId: obj.boardId}, function(err, numAffected){
              if(err)
                console.log(err)
              boardList.addMember({username: obj.username, boardId: obj.boardId}, function(err, numAffected){
                if(err)
                  console.log(err)
                boardList.getBoardById(obj.boardId, function(err, board){
                  userList.getUsers(board.members, function(err, users){
                    if(err)
                      console.log(err)
                    var user_arr = []
                    users.forEach(function(user){
                      user_arr.push({username: user.username, name: user.name, currentBoard: user.currentBoard})
                    })
                    var json = JSON.stringify({ body: {code: 'getMembers', members: user_arr}})
                    //connection.send(json)
                    console.log('json: '+json)
                    wsServer.clients.forEach(function each(client) {
                      if(client['boardId'] == connection['boardId']){
                        client.send(json)
                        //console.log('sent json:'+json)
                      }
                    });
                    })
                })
            })
            })
          }
        }

        else if(obj.from == 'BoardManager'){

          if(obj.code == 'tagBoardManager'){
            connection['boardId'] = obj.boardId
            connection['username'] = obj.username
            var cc = util.inspect(connection)
            console.log('Client: '+connection['username'] + ' connect board manager: '+connection['boardId'])
          }

          else if(obj.code == 'boardAddTag'){
            console.log(obj)
            boardList.addTag({boardId: obj.boardId, tag: obj.tag}, function(err, numAffected){
              if(err)
                console.log(err)
              boardList.getBoardById(obj.boardId, function(err, board){
                if(err)
                  console.log(err)
                var json = JSON.stringify({ body: {code: 'getTags', tags: board.tags}})
                wsServer.clients.forEach(function each(client) {
                  if(client['boardId'] == connection['boardId']){
                    client.send(json)
                    //console.log('sent json:'+json)
                  }
                });
              })
            })
          }

          else if(obj.code == 'searchUser'){
            console.log(obj)
            userList.searchUsers(obj.username, function(err, users){
              if(err)
                console.log(err)
              var user_arr = []
              var itemsProcessed = 0;
              async.forEachOf(users, function (user, key, callback) {
                boardList.findBoard({'_id': obj.boardId, 'members': user.username}, function(err, boards){
                  if (err) 
                    return callback(err);
                  if(boards.length == 0){
                    user_arr.push({username: user.username, joined: false})
                  }
                  else{
                    user_arr.push({username: user.username, joined: true})
                  }
                  console.log('boards length: '+boards.length)
                  itemsProcessed++;
                  if(itemsProcessed == users.length){
                    console.log('user_arr: '+user_arr)
                    var json = JSON.stringify({ body: {code: 'getUserSearchResult', userList: user_arr}})
                    connection.send(json)
                  }
                  callback()
                })
              }, function (err) {
                if (err) console.error(err.message);
              })
              /*users.forEach(function each(user){
                boardList.findBoard({'_id': obj.boardId, 'members': user.username}, function(err, boards){
                  if(err)
                    console.log(err)
                  if(boards.length == 0){
                    user_arr.push({username: user.username, joined: 0})
                  }
                  else{
                    user_arr.push({username: user.username, joined: 1})
                  }
                  console.log('boards length: '+boards.length)
                  user_arr.push(1)
                })*/
            })
          }

          else if(obj.code == 'inviteUser'){
            console.log(obj)
            var now = new Date()
            var newNoti = {
                      notificationType: 'reply',
                      boardId: obj.boardId,
                      boardName: obj.boardName,
                      user: obj.username,
                      detail: 'You are invited to board: '+obj.boardName,
                      date: dateFormat(now, 'd mmmm yyyy HH:MM')
                    }
            notificationList.createNotification({newNoti: newNoti, users: [obj.username]}, function(err, noti){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getNotificationt', notification: noti}});
              wsServer.clients.forEach(function each(client) {
                if(client['from'] == 'Home' && client['username'] == obj.username){
                  client.send(json)
                }
              });
            })
          }

          else if(obj.code == 'boardDeleteTag'){
            console.log(obj)
            boardList.deleteTag({boardId: obj.boardId, tag: obj.tag}, function(err, numAffected){
                boardList.getBoardById(obj.boardId, function(err, board){
                  if(err)
                    console.log(err)
                  var json = JSON.stringify({ body: {code: 'getTags', tags: board.tags}})
                  wsServer.clients.forEach(function each(client) {
                    if(client['boardId'] == connection['boardId']){
                      client.send(json)
                      console.log('sent json:'+json)
                    }
                  });
                })
                });
          }

          
        }

        if(obj.code == 'boardGetTags'){
          console.log(obj)
          boardList.getBoardById(obj.boardId, function(err, board){
            if(err)
              console.log(err)
            var json = JSON.stringify({ body: {code: 'getTags', tags: board.tags}})
            connection.send(json)
          })
        }

        if(obj.code == 'getMembers'){
          console.log(obj)
          boardList.getBoardById(obj.boardId, function(err, board){
            if(err)
              console.log(err)
            userList.getUsers(board.members, function(err, users){
              if(err)
                console.log(err)
              var user_arr = []
              users.forEach(function(user){
                user_arr.push({username: user.username, name: user.name, currentBoard: user.currentBoard})
              })
              var json = JSON.stringify({ body: {code: 'getMembers', members: user_arr}})
              connection.send(json)
              console.log('json: '+json)
            })
            
          })
        }

    });
    connection.on('close', function(reasonCode, description) {
      console.log('Client: '+connection['username'] + ' disconnect')
        //console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function countTimer(){
  userList.countTimer(0, function(err, numAffected){
    if(err)
      console.log(err)
    var now = new Date()
    dateFormat(now, 'default')
    //console.log(dateFormat(now, 'd mmmm yyyy HH:MM'))
  })
}

setInterval(countTimer, 1000)




/*var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database connected!");
  db.close();
});
*/
//console.log("Node Server Start!");