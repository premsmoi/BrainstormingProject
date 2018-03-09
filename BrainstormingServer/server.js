var express = require('express'),
    app = express(),
    http = require('http').Server(app);
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    User = require('./src/models/UserModel'),
    Board = require('./src/models/BoardModel'),
    Note = require('./src/models/NoteModel'),
    boardList = require('./src/controllers/BoardController'),
    noteList = require('./src/controllers/NoteController'),
    userList = require('./src/controllers/UserController'),
    WebSocket = require('ws'),
    validator = require('express-validator'),
    passport = require('passport'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    util = require('util'),
    async = require('async'),
    sleep = require('sleep');




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
    
    //var connection = request.accept('echo-protocol', request.origin);

    //console.log(connection)
    //console.log((new Date()) + ' Connection accepted.');
    
    connection.on('message', function incomiing(message) {
        var obj = JSON.parse(message)  
        //console.log('message: '+obj)
        //console.log(obj)
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
            })
          }

          else if(obj.code == 'exitBoard'){
            console.log(obj)
            userList.exitBoard(obj.username, function(err, numAffected){
              if(err)
                console.log(err)
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
                    console.log('sent json:'+json)
                  }
                });
              })
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
            })
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
      console.log('Client: '+connection['username'] + ' disconnect board: '+connection['boardId'])
        //console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function countTimer(){
  userList.countTimer(0, function(err, numAffected){
    if(err)
      console.log(err)
    console.log('Count')
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