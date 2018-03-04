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
    WebSocket = require('ws'),
    validator = require('express-validator'),
    passport = require('passport'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    util = require('util'),
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
            var newNote = new Note(obj.note)
             noteList.create_a_note(newNote);

             Board.update({ _id: newNote.boardId}, 
              {
                $push: { notes: newNote._id }
              },
              function(err, numAffected){
                boardList.getBoardById(newNote.boardId, function(err, board){
                  if(err)
                    console.log(err)
                  //console.log('find board: '+board)

                  var id_arr = []
                  board.notes.forEach(function(element){
                    id_arr.push(element)
                  });


                  noteList.getNotes(id_arr, function(err, notes){
                    if(err)
                      console.log(err)
                    var json = JSON.stringify({ body: {code: 'updatedNotes', notes: notes} });
                    wsServer.clients.forEach(function each(client) {
                      if(client['boardId'] == connection['boardId'] && client['from'] == 'Board'){
                        sleep.msleep(100)
                        client.send(json)
                      }
                    });
                  })
              }
            )
     
            });
          }
          else if(obj.code == 'getNotes'){
            boardList.getBoardById(obj.boardId, function(err, board){
              if(err)
                console.log(err)
                var id_arr = []
                board.notes.forEach(function(element){
                  id_arr.push(element)
                })

                  noteList.getNotes(id_arr, function(err, notes){
                    if(err)
                      console.log(err)
                    //console.log('note list: '+notes)
                    //console.log('This should print after')
                    var json = JSON.stringify({ body: {code: 'updatedNotes', notes: notes} });
                    //console.log(json)
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

            Board.update({ _id: obj.boardId}, 
              {
                $pull: { notes: obj.noteId }
              },
              function(err, numAffected){
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
            Note.update({_id: obj.updatedObj.id}, 
              { $set: obj.updatedObj },
              function(err, note){
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
            Board.update({_id: obj.boardId}, 
              { $set: { notes: obj.newNoteList}},
              function(err, board){
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

          else if(obj.code == 'NoteAddTags'){
            console.log(obj)
            Board.update({_id: obj.boardId}, 
              { $set: { tags: obj.tags}},
              function(err, board){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getTags', tag: board.tags}})
              wsServer.clients.forEach(function each(client) {
                if(client['boardId'] == connection['boardId'] && client['from'] == 'Board'){
                  client.send(json)
                }
              });
            })
          }

          else if(obj.code == 'boardGetTags'){
            console.log(obj)
            Board.find({_id: obj.boardId},
              function(err, board){
              if(err)
                console.log(err)
              console.log('tags: '+board.tags)
              var json = JSON.stringify({ body: {code: 'getTags', tag: board.tags}})
              wsServer.clients.forEach(function each(client) {
                if(client['boardId'] == connection['boardId'] && client['from'] == 'Board'){
                  client.send(json)
                }
              });
            })
          }
        }

        if(obj.from == 'BoardManager'){
          if(obj.code == 'tagBoardManager'){
            connection['boardId'] = obj.boardId
            connection['username'] = obj.username
            var cc = util.inspect(connection)
            console.log('Client: '+connection['username'] + ' connect board manager: '+connection['boardId'])
          }
          else if(obj.code == 'boardAddTag'){
            console.log(obj)
            Board.update({_id: obj.boardId}, 
              { $push: { tags: obj.tag}},
              function(err, numAffected){
              if(err)
                console.log(err)
              Board.findOne({_id: obj.boardId},
              function(err, result){
                if(err)
                  console.log(err)
                var json = JSON.stringify({ body: {code: 'getTags', tags: result.tags}})
                wsServer.clients.forEach(function each(client) {
                  if(client['boardId'] == connection['boardId']){
                    client.send(json)
                    console.log('sent json:'+json)
                  }
                });
              })
            })
          }

          else if(obj.code == 'boardGetTags'){
            console.log(obj)
            Board.findOne({_id: obj.boardId},
              function(err, result){
              if(err)
                console.log(err)
              var json = JSON.stringify({ body: {code: 'getTags', tags: result.tags}})
              wsServer.clients.forEach(function each(client) {
                if(client['boardId'] == connection['boardId']){
                  client.send(json)
                  console.log('sent json:'+json)
                }
              });
            })
          }

          else if(obj.code == 'deleteTag'){
            console.log(obj)
            Board.update({ _id: obj.boardId}, 
              {
                $pull: { tags: obj.tag }
              },
              function(err, numAffected){
                Board.findOne({_id: obj.boardId},
                  function(err, result){
                  if(err)
                    console.log(err)
                  var json = JSON.stringify({ body: {code: 'getTags', tags: result.tags}})
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
    });
    connection.on('close', function(reasonCode, description) {
      console.log('Client: '+connection['username'] + ' disconnect board: '+connection['boardId'])
        //console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});



/*var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database connected!");
  db.close();
});
*/
//console.log("Node Server Start!");