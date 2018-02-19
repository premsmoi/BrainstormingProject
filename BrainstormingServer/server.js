var express = require('express'),
    app = express(),
    http = require('http').Server(app);
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
  	bodyParser = require('body-parser'),
  	User = require('./src/models/UserModel'),
    Board = require('./src/models/BoardModel'),
    Note = require('./src/models/NoteModel'),
    boardList = require('./src/controllers/BoardController');
    noteList = require('./src/controllers/NoteController');
    WebSocketServer = require('websocket').server,
    validator = require('express-validator'),
    passport = require('passport'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,



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

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var connectionList = []


wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);

    console.log(connection)
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
      var obj = JSON.parse(message.utf8Data)
        
        //console.log(obj)
        if(obj.code == 'createNote'){
          //console.log('In CreateNote')
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
                for(i=0;i<board.notes.length;i++){
                  id_arr.push(board.notes[i])
                }

                noteList.getNotes(id_arr, function(err, notes){
                  if(err)
                    console.log(err)
                  console.log('note list: '+notes)
                  console.log('This should print after')
                  var json = JSON.stringify({ body: {code: 'updatedNotes', notes: notes} });
                  console.log(json)
                  connection.sendUTF(json);
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
                for(i=0;i<board.notes.length;i++){
                  id_arr.push(board.notes[i])
                }

                noteList.getNotes(id_arr, function(err, notes){
                  if(err)
                    console.log(err)
                  //console.log('note list: '+notes)
                  //console.log('This should print after')
                  var json = JSON.stringify({ body: {code: 'updatedNotes', notes: notes} });
                  //console.log(json)
                  connection.sendUTF(json);
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

            })
        }

        else if(obj.code == 'updateNotePosition'){
          console.log('updateNotePosition')
          Note.update({_id: obj.noteId}, 
            { $set: { x: obj.newX, y: obj.newY, updated: obj.updated}},
            function(err, note){
            if(err)
              console.log(err)
          })
        }

        else if(obj.code == 'updateNoteText'){
          console.log(obj)
          Note.update({_id: obj.noteId}, 
            { $set: { text: obj.newText, updated: obj.updated}},
            function(err, note){
            if(err)
              console.log(err)
          })
        }

        else if(obj.code == 'updateNoteList'){
          console.log(obj)
          Board.update({_id: obj.boardId}, 
            { $set: { notes: obj.newNoteList}},
            function(err, board){
            if(err)
              console.log(err)
          })
        }

        /*
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
        */
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
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