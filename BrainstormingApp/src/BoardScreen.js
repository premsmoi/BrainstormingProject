import React, {
  Component
} from 'react';
import {
  Alert,
  AppRegistry,
  Button,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
  ImageBackground,
  CheckBox,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import styles from "./app.style";
import {
  noteColor,
  borderColor
} from './colors'
import Modal from "react-native-modal";
import {
  StackNavigator,
  NavigationActions
} from 'react-navigation';
import Note from './Note';
import SmallNote from './SmallNote';
import {
  ip,
  boardWidth,
  boardHeight
} from './Configuration';

//import DoubleClick from 'react-native-double-click';

import io from 'socket.io-client';

//const ip = '10.0.2.2:8080'
//const ip = '192.168.43.143:8080'
const socket = io(ip);
//import IO from 'socket.io-client/socket.io';

class BoardScreen extends Component {

  constructor(props) {
    super(props);
    this.newId = 2;
    this.tempNote = null;
    this.totalLoad = 6;
    this.lastPressObj = {
      time: new Date().getTime(),
      noteId: null,
    }
    this.currentBoardWidth = 0;
    this.currentBoardHeight = 0;
    this.state = {
      board: null,
      openWebSocket: false,
      boardName: '',
      startButtonText: 'Start',
      startedBoard: '',
      timeRemaining: null,
      numberOfVote: null,
      currentLoad: 0,
      //noteList : [ {id: 1, x: 0, y: 0, color: 'blue', text: 'My name is Smoi'},
      //             {id: 2, x: 100, y: 100, color: 'pink', text: 'Passakorn'} ],
      noteList: [],
      votedNoteList: [],
      visibleNewNoteModal: false,
      visibleEditNoteModal: false,
      visibleSelectTagsModal: false,
      visibleShowMembersModal: false,
      visibleInviteModal: false,
      visibleGroupNotesModal: false,
      newColor: 'red',
      newNoteText: '',
      newNoteTags: [],
      newTagSelection: {},
      tags: [],
      newNoteTags: [],
      tagSelection: {},
      userSearchResult: [],
      selectedUserToInvite: '',
      usernameSearchQuery: '',
      noteSearchQuery: '',
      members: [],
      scrollX: 0,
      scrollY: 0,
    }
    this.user = this.props.navigation.state.params.user
    this.isVisibleOpenNoteModal = false;
    this.deleteNote = this.deleteNote.bind(this);
    this.focusNote = this.focusNote.bind(this);
    this.updateNoteList = this.updateNoteList.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.setVisibleOpenNoteModal = this.setVisibleOpenNoteModal.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.getState = this.getState.bind(this);
    this.openShowMembersModal = this.openShowMembersModal.bind(this);
    this.exitBoard = this.exitBoard.bind(this);
    this.countTimer = this.countTimer.bind(this);
    this.getTimeRemaining = this.getTimeRemaining.bind(this);
    this.toBoardManager = this.toBoardManager.bind(this);
    this.openNewNoteModal = this.openNewNoteModal.bind(this);
    this.getVoteStatus = this.getVoteStatus.bind(this);
    this.voteNote = this.voteNote.bind(this);
    this.unvoteNote = this.unvoteNote.bind(this);
    this.getLastPress = this.getLastPress.bind(this);
    this.setLastPress = this.setLastPress.bind(this);
    //console.log(this.props)
    this.state.tags.map((tag) => {
          let tempTagSelection = this.state.newTagSelection
          tempTagSelection[tag] = false
          //console.log('now tag: '+tag)
          //console.log('tempTagSelection: '+JSON.stringify(tempTagSelection)
          this.setState({ tagSelection: tempTagSelection }, () => {
          this.setState({ newTagSelection: tempTagSelection })
          })
        })
    //console.log('start newTagSelection: '+JSON.stringify(this.state.newTagSelection))
    //console.log('start tagSelection: '+JSON.stringify(this.state.tagSelection))
    //console.log('newTagSelection: '+JSON.stringify(this.state.newTagSelection))
    //this.ws = new WebSocket('ws://10.0.2.2:8080', 'echo-protocol');
    this.ws = new WebSocket('ws://' + ip, 'echo-protocol');

    this.ws.onmessage = (e) => {
      // a message was received
      //console.log("e.data: "+e.data);
      var obj = JSON.parse(e.data)
      //console.log(obj.body.notes)

      if (obj.body.code == 'getBoard') {
        console.log('I got board')
        this.setState({currentLoad: ++this.state.currentLoad})
        this.setState({board: obj.body.board, timeRemaining: obj.body.board.limitedTime})
      }

      if (obj.body.code == 'getNotesTrigger') {
        console.log('I got notes trigger')
        this.getNotes();
      }

      if (obj.body.code == 'closeWebSocket') {
        console.log('closeWebSocket')
        this.ws.close()
      }

      if (obj.body.code == 'getNotes') {
        if (this.isVisibleOpenNoteModal == false) {
          this.setState({
            noteList: []
          })
          this.setState({
            noteList: obj.body.notes
          })
          console.log('i got notes')
          this.setState({currentLoad: ++this.state.currentLoad})
        }
      }

      if (obj.body.code == 'getTags') {
        this.setState({
          tags: obj.body.tags
        })
        console.log('I got tag')
        this.state.tags.map((tag) => {
          let newTagSelection = this.state.tagSelection
          newTagSelection[tag] = false
          this.setState({
            tagSelection: newTagSelection
          })
        })
        this.setState({currentLoad: ++this.state.currentLoad})
      }


      if (obj.body.code == 'getMembers') {
        this.setState({
          members: obj.body.members
        })
        console.log('I got members')
        this.state.tags.map((tag) => {
          let newTagSelection = this.state.tagSelection
          newTagSelection[tag] = false
          this.setState({
            tagSelection: newTagSelection
          })
        })
        this.setState({currentLoad: ++this.state.currentLoad})
      }

      if (obj.body.code == 'getBoardStartStatus') {
        console.log('I got board start status')
        this.setState({
          startedBoard: obj.body.status
        })
        this.setState({currentLoad: ++this.state.currentLoad})
      }

      if (obj.body.code == 'getTimer') {
        console.log('I got timer')
        this.setState({
          timeRemaining: obj.body.timeRemaining
        })
        this.setState({currentLoad: ++this.state.currentLoad})
      }

      if(obj.body.code == 'getUserSearchResult'){
        this.setState({userSearchResult: obj.body.userList})
        console.log(obj.body.userList)
      }

      if(obj.body.code == 'getVotedNotes'){
        this.setState({votedNoteList: obj.body.votedNotes})
        console.log('I got voted notes : '+obj.body.votedNotes)
      }
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    this.ws.onclose = (e) => {
      // connection closed
      this.setState({
        openWebSocket: false
      })
      console.log(e.code, e.reason);
      console.log('Closed!')
    };

    this.ws.onopen = () => {
      // connection opened
      console.log('This is Board Screen!')
      this.setState({
        openWebSocket: true
      })
      console.log('1')
      this.getNotes();
      console.log('2')
      //ws.send('Hello Node Server!'); // send a message
      var tagClientRequest = {
        from: 'Board',
        code: 'tagBoard',
        username: this.props.navigation.state.params.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(tagClientRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)
      //console.log('req: ' + requestString)

      var getTagsRequest = {
        from: 'Board',
        code: 'boardGetTags',
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(getTagsRequest)
      this.ws.send(requestString)

      var enterBoardRequest = {
        from: 'Board',
        code: 'enterBoard',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(enterBoardRequest)
      this.ws.send(requestString)

      var boardGetTimerRequest = {
        from: 'Board',
        code: 'boardGetTimer',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(boardGetTimerRequest)
      //this.ws.send(requestString)

      var getBoardRequest = {
        from: 'Board',
        code: 'getBoard',
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(getBoardRequest)
      this.ws.send(requestString)

      var getVoteRequest = {
        from: 'Board',
        code: 'getVote',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(getVoteRequest)
      this.ws.send(requestString)

      var getUserVotedNotesRequest = {
        from: 'Board',
        code: 'getUserVotedNotes',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(getUserVotedNotesRequest)
      this.ws.send(requestString)

      this.getBoardStartStatus()
      console.log('3')
    };

    setInterval(this.countTimer, 1000)

  }

  getLastPress(){
    return this.lastPressObj;
  }

  setLastPress(obj){
   this.lastPressObj = obj
  }

  toBoardManager() {
    this.setState({
      openWebSocket: false
    })
    this.props.navigation.navigate(
      'BoardManager', {
        user: this.props.navigation.state.params.user,
        boardId: this.props.navigation.state.params.boardId,
        boardName: this.props.navigation.state.params.boardName,
        board: this.state.board,
      }
    )
    this.ws.close()
  }

  openNewNoteModal() {
    this.setState({
      visibleNewNoteModal: true
    })
  }

  openShowMembersModal() {
    this.setState({
      visibleShowMembersModal: true,
    })
  }

  getTimeRemaining() {
    console.log('timeRemaining: ' + this.state.timeRemaining)
  }


  getState() {
    return this.state
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.ws.close()
    this.props.navigation.navigate('Home', {
      user: this.props.navigation.state.params.user
    })
    return true;
  }

  setVisibleOpenNoteModal(bool) {
    this.isVisibleOpenNoteModal = bool;
  }


  countTimer() {
    //console.log('startedBoard: '+this.state.startedBoard)
    if (this.state.startedBoard == 1 && this.state.timeRemaining > 0 && this.state.openWebSocket == true) {
      var boardGetTimerRequest = {
        from: 'Board',
        code: 'boardGetTimer',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(boardGetTimerRequest)
      this.ws.send(requestString)
      console.log('count timer')
    }
  }

  async searchUsername() {
    var searchUserRequest = {
      from: 'Board',
      code: 'searchUser',
      username: this.state.usernameSearchQuery,
      boardId: this.props.navigation.state.params.boardId
    }
    var requestString = JSON.stringify(searchUserRequest)
    console.log('Search User Request')
    this.ws.send(requestString)
  }

  async inviteUser() {
    var inviteUserRequest = {
      from: 'Board',
      code: 'inviteUser',
      username: this.state.selectedUserToInvite,
      boardId: this.props.navigation.state.params.boardId,
      boardName: this.props.navigation.state.params.boardName,
    }
    var requestString = JSON.stringify(inviteUserRequest)
    console.log('Invite User Request')
    this.ws.send(requestString)
    //this.getMembers()
    this.setState({
      selectedUserToInvite: '',
    })
  }

  getBoardStartStatus() {
    var getBoardStartStatusRequest = {
      from: 'Board',
      code: 'getBoardStartStatus',
      username: this.user.username,
      boardId: this.props.navigation.state.params.boardId,
    }
    var requestString = JSON.stringify(getBoardStartStatusRequest)
    this.ws.send(requestString)
  }

  getNotes() {
    var getNotesRequest = {
      from: 'Board',
      code: 'getNotes',
      boardId: this.props.navigation.state.params.boardId,
    }
    var requestString = JSON.stringify(getNotesRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  updateNote(updatedObj) {
    var newNoteRequest = {
      from: 'Board',
      code: 'updateNote',
      updatedObj: updatedObj,
      updated: new Date().getTime(),
    }
    var requestString = JSON.stringify(newNoteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  updateNoteList() {
    var newNoteRequest = {
      from: 'Board',
      code: 'updateNoteList',
      boardId: this.props.navigation.state.params.boardId,
      newNoteList: this.state.noteList,
    }
    var requestString = JSON.stringify(newNoteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  focusNote = (focusId) => {
    //console.log('focusId: '+focusId)
    var tempList = this.state.noteList
    var deletedNote = this.state.noteList.find(function(note) {
      return note._id == focusId
    })
    var deletedIndex = this.state.noteList.findIndex(function(note) {
      return note._id == focusId
    })
    //console.log('deletedIndex: '+deletedIndex)
    tempList.splice(deletedIndex, 1)
    tempList.push(deletedNote)
    this.setState({
      noteList: tempList
    })
    //this.updateNoteList();
  }

  createNewNote = () => {
    this.state.tags.map((tag) => {
      if (this.state.tagSelection[tag]) {
        let newTags = this.state.newNoteTags
        newTags.push(tag)
        this.setState({
          newNoteTags: newTags
        })
      }
    })
    console.log('new tags: ' + this.state.newNoteTags)
    var newNote = {
      boardId: this.props.navigation.state.params.boardId,
      writer: this.props.navigation.state.params.user.username,
      x: 100,
      y: 200,
      color: this.state.newColor,
      text: this.state.newNoteText,
      tags: this.state.newNoteTags,
      updated: new Date().getTime(),
    }
    this.setState(previousState => {
      //console.log(previousState.noteList)
      var newNoteList = previousState.noteList
      newNoteList.push(newNote)
      //console.log('newNoteList'+newNoteList)
      return {
        noteList: newNoteList
      }
    });
    //console.log(this.state.noteList)
    //console.log(this.state.noteList)
    //Alert.alert('Create Idea!');
    var newNoteRequest = {
      from: 'Board',
      code: 'createNote',
      note: newNote,
    }
    var requestString = JSON.stringify(newNoteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  deleteNote = (deletedId) => {
    //var tempList = this.state.noteList
    //var deletedIndex = this.state.noteList.findIndex(function(_id) {return _id == deletedId})
    //tempList.splice(deletedIndex, 1)
    //this.setState({noteList: tempList})

    var deleteNoteRequest = {
      from: 'Board',
      code: 'deleteNote',
      noteId: deletedId,
      boardId: this.props.navigation.state.params.boardId,
    }
    var requestString = JSON.stringify(deleteNoteRequest)
    console.log('delete')
    this.ws.send(requestString)
    this.getNotes()
  }

  exitBoard() {
    this.setState({
      openWebSocket: false
    })
    var exitBoardRequest = {
      from: 'Board',
      code: 'exitBoard',
      username: this.user.username,
      boardId: this.props.navigation.state.params.boardId,
    }
    var requestString = JSON.stringify(exitBoardRequest)
    console.log('exitBoard')
    this.ws.send(requestString)
    this.props.navigation.navigate('Home', {
      user: this.props.navigation.state.params.user
    })
    //this.ws.close()
  }

  startBoard() {
    var starttBoardRequest = {
      from: 'Board',
      code: 'startBoard',
      username: this.user.username,
      boardId: this.props.navigation.state.params.boardId,
      setTime: this.state.timeRemaining,
    }
    var requestString = JSON.stringify(starttBoardRequest)
    console.log('Start Board !!!')
    this.ws.send(requestString)
  }

  reRenderByNotes(newNoteList){
    this.setState({
      noteList: newNoteList
    })
  }

  groupNotesByTag(){
    //console.log('tags: '+JSON.stringify(this.state.tags))
    var newNoteList = this.state.noteList
    var x = -150;
    var y = 0;
    var count = 0
    var maxY = 150
    this.state.tags.map((tag) => {
      x += 175;
      y  = Math.floor(count/5)*maxY + 50;
      var includesNote = false;
      newNoteList.map((note) => {
        if(note.tags.includes(tag)){
          //console.log('Hit!')
          note.x = x;
          note.y = y;
          var updatedObj = {
              id: note._id,
              x: note.x,
              y: note.y,
              updated: new Date().getTime(),
            }
          this.updateNote(updatedObj)
          y += 40;
          x += 10
          includesNote = true;
          if(y + 150 > maxY){
            maxY = y + 150;
          }
        }
      })
      if(includesNote){
        count++
        if(count % 5 == 0){
          x = -150;
        }
      }
    })
    this.setState({
            noteList: []
          }, () => {
            this.setState({noteList: newNoteList}, () => {
              this.updateNoteList()
            })
          })

    
    //console.log('notes: '+JSON.stringify(this.state.noteList))
  }

  groupNotesByColor(){
    //console.log('tags: '+JSON.stringify(this.state.tags))
    var colors = ['red','pink','blue','green','yellow']
    var newNoteList = this.state.noteList
    var x = -150;
    var y;
    colors.map((color) => {
      x += 175;
      y  = 50;
      count_note = 0
      newNoteList.map((note) => {
        if(note.color == color){
          //console.log('Hit!')
          note.x = x;
          note.y = y;
          var updatedObj = {
              id: note._id,
              x: note.x,
              y: note.y,
              updated: new Date().getTime(),
            }
          this.updateNote(updatedObj)
          x += 10;
          y += 40;
          count_note++
        }
      })
      if(count_note == 0){
        x -= 175
      }
    })
    this.setState({
            noteList: []
          }, () => {
            this.setState({noteList: newNoteList}, () => {
              this.updateNoteList()
            })
          })

    
    //console.log('notes: '+JSON.stringify(this.state.noteList))
  }

  spreadNotes(){
    //console.log('tags: '+JSON.stringify(this.state.tags))
    var newNoteList = this.state.noteList
    var x = -150;
    var y = 25;
    count_note = 0;
    newNoteList.map((note) => {
      x += 190;
      note.x = x;
      note.y = y;
      var updatedObj = {
              id: note._id,
              x: note.x,
              y: note.y,
              updated: new Date().getTime(),
            }
      this.updateNote(updatedObj)
      count_note++;
      if(count_note%5 == 0){
        x = -150;
        y += 175;
      }
    })
    this.setState({
            noteList: []
          }, () => {
            this.setState({noteList: newNoteList}, () => {
              this.updateNoteList()
            })
          })

    
    //console.log('notes: '+JSON.stringify(this.state.noteList))
  }

  getVoteStatus(noteId){
    if(this.state.votedNoteList.includes(noteId)){
      return true;
    }
    else
      return false;
  }

  voteNote(noteId){
    var voteNoteRequest = {
      from: 'Board',
      code: 'voteNote',
      username: this.user.username,
      boardId: this.props.navigation.state.params.boardId,
      votedNoteId: noteId,
    }
    var requestString = JSON.stringify(voteNoteRequest)
    this.ws.send(requestString)
  }

  unvoteNote(noteId){
    var unvoteNoteRequest = {
      from: 'Board',
      code: 'unvoteNote',
      username: this.user.username,
      boardId: this.props.navigation.state.params.boardId,
      unvotedNoteId: noteId,
    }
    var requestString = JSON.stringify(unvoteNoteRequest)
    this.ws.send(requestString)
  }

  searchNote(){
    Alert.alert('search')
    this.forceUpdate()
  }

  handleScrollX(event) {
    console.log('X: '+event.nativeEvent.contentOffset.x);

    console.log('currentBoardSize: '+this.currentBoardWidth+' '+this.currentBoardHeight)
    if(this.currentBoardWidth == 0 && this.currentBoardHeight == 0){
      console.log(JSON.stringify(event.nativeEvent.layoutMeasurement))
      this.currentBoardHeight = event.nativeEvent.layoutMeasurement.height;
      this.currentBoardWidth = event.nativeEvent.layoutMeasurement.width;  
    }
  }

  handleScrollY(event) {
   console.log('Y: '+event.nativeEvent.contentOffset.y);

    console.log('currentBoardSize: '+this.currentBoardWidth+' '+this.currentBoardHeight)
    if(this.currentBoardWidth == 0 && this.currentBoardHeight == 0){
      console.log(JSON.stringify(event.nativeEvent.layoutMeasurement))
      this.currentBoardHeight = event.nativeEvent.layoutMeasurement.height;
      this.currentBoardWidth = event.nativeEvent.layoutMeasurement.width;  
    }
  }

  _renderColorPicker = (color) => (
    <TouchableOpacity onPress={() => this.setState({newColor: color})}>
      <View style={{
        backgroundColor: noteColor[color],
        borderColor: 'black',
        borderWidth: 0.5,
        width: 50,
        height: 50,}}>
      </View>
    </TouchableOpacity>
  )

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  )

  _renderTextInput = (placeholder, onChange, value) => (
    <View>
      <TextInput
          style={{
            height: 36, 
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
          value = {value}
      />
    </View>
  )

  _renderNewNoteModal = () => (
    <View style={{
      backgroundColor: noteColor[this.state.newColor],
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      borderRadius: 4,
    }}>
      <View style={{flexDirection: 'row', padding: 6, margin: 8,}}>
        {this._renderColorPicker('red')}
        {this._renderColorPicker('pink')}
        {this._renderColorPicker('green')}
        {this._renderColorPicker('blue')}
        {this._renderColorPicker('yellow')}
      </View>
      <View>
        <TextInput
            style={{ 
              fontSize: 20,
              marginTop   : 15,
              marginLeft  : 15,
              marginRight : 15,
              textAlignVertical: "top",
              //borderColor: 'black',
              //borderWidth: 0.5,
            }}
            onChangeText={(newNoteText) => this.setState({newNoteText})}
            value={this.state.newNoteText}
            multiline = {true}
            numberOfLines = {6}
            maxLength = {100}
            placeholder = {'Text Here..'}
            underlineColorAndroid = {noteColor[this.state.newColor]}
        />
      </View>
      <View style = {{flexDirection: 'row'}} >
        <Text 
          style={{
            fontSize: 16, 
            color: 'grey',  
            marginVertical: 5, 
            marginLeft: 20 
          }}>Tags:</Text>
          {
            this.state.tags.map((tag) => {
            if(this.state.newTagSelection[tag]){
              return(
                <Text 
                  key = {tag}
                  style={{
                    fontSize: 16, 
                    color: 'black',  
                    marginVertical: 5, 
                    marginHorizontal: 5 
                  }}>
                  {tag}
                </Text>
              )
            
            }
          })}
          <TouchableOpacity onPress = {() => {this.setState({visibleSelectTagsModal: true})}}>
            <Image
              style={{width: 16, height: 16, marginTop: 8, marginLeft: 5}}
              source={require('../img/pencil.png')}
            />
          </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("OK", () => {
            this.setState({ visibleNewNoteModal: false })
            this.setState({newTagSelection: {}, newNoteTags: [], newNoteText:''})
            this.createNewNote()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => {
            this.setState({ visibleNewNoteModal: false })
            this.setState({newTagSelection: {}, newNoteTags: [], newNoteText:''})
          })}
        </View>
        <View style = {{flex: 1}}/>
      </View>
    </View>
  )

  _renderSelectTagsModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      { 
        this.state.tags.map((tag) => {
        return(
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              value={this.state.newTagSelection[tag]}
              onValueChange={() => {
                let tempTagSelection = this.state.newTagSelection
                tempTagSelection[tag] = !tempTagSelection[tag]
                this.setState({ newTagSelection: tempTagSelection })
                console.log(this.state.newTagSelection)
              }
              }
            />
            <Text style={{marginTop: 5}}>{tag}</Text>
          </View>
        )
      })}
      {this._renderButton("OK", () => {
        this.setState({ visibleSelectTagsModal: false })
        let newTags = [];
        this.setState({newNoteTags: []})
        this.state.tags.map((tag) => {
          if(this.state.newTagSelection[tag]){
              newTags.push(tag)
              console.log('newTags: '+newTags)
              this.setState({newNoteTags: []}, () => {
                this.setState({newNoteTags: newTags}, () => {
                   console.log('newNoteTags: '+this.state.newNoteTags)
                })
              })
          }
        })
        
      })}
    </View>
  )

  _renderShowMembersModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      <View style = {{flexDirection:'row'}}>
        <Text style={{fontSize: 20, 
              color: 'grey',  
              marginVertical: 5, 
              marginHorizontal: 20 
            }}>Members</Text>
        <TouchableWithoutFeedback
          onPress={() => this.setState({visibleInviteModal: true})}
        >
          <View>   
            <Text style={{
              fontSize: 16, 
              color: '#70cdef',  
              marginVertical: 10, 
              marginLeft: 140, 
            }}>
              Invite
            </Text>
           </View> 
        </TouchableWithoutFeedback>
      </View>
          {this.state.members.map((user) => {
            return(
                <View style={{flexDirection: 'row'}} key = {user} >
                  <View style={{flex: 1}}>
                    <Text 
                      style={{
                        fontSize: 18, 
                        color: 'black', 
                        marginVertical: 5,
                        marginLeft: 30,
                      }}>
                        {user.username}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text 
                      style={{
                        fontSize: 18, 
                        color: user.currentBoard == this.props.navigation.state.params.boardId? 'green' : 'red',  
                        marginVertical: 5,
                        marginLeft: 30,
                      }}>
                        {user.currentBoard == this.props.navigation.state.params.boardId? 'online' : 'offline'}
                    </Text>
                  </View>
              </View>
            )
          })}
      {this._renderButton("OK", () => {
        this.setState({ visibleShowMembersModal: false })
      })}
    </View>
  )

  _renderInviteModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{borderWidth: 3, borderColor: 'white'}}>
            <Text style={{fontSize: 16, textAlign: 'center'}}>Search username : </Text>
          </View>
          {this._renderTextInput('Search Input', 
            (usernameSearchQuery) => { this.setState({usernameSearchQuery})},
            this.state.usernameSearchQuery
          )}
          <View>
            {this._renderButton("Search", () => {this.searchUsername()})}
          </View>
        </View>
        <View style={{}}>
            {this.state.userSearchResult.map((user) => {
              return(
                  <TouchableWithoutFeedback
                    onPress = {() => {
                      user.joined == true? 
                      this.setState({selectedUserToInvite: ''}) : this.setState({selectedUserToInvite: user.username})
                    }}
                    key = {user.username}
                  >
                    <View style = {{flexDirection: 'row', backgroundColor: user.username==this.state.selectedUserToInvite && user.joined == false? 
                      'lightblue':'white'}}>
                      <Text 
                        style={{
                          fontSize: 16, 
                          color: 'black',  
                          marginVertical: 4, 
                          marginHorizontal: 8 
                        }}
                      >
                          {user.username}
                      </Text>
                      <Text 
                        style={{
                          fontSize: 16, 
                          color: 'red',  
                          marginVertical: 4, 
                          marginHorizontal: 8 
                        }}
                      >
                          {(user.joined == true? ' has joined' : '')}
                      </Text> 
                    </View>
                  </TouchableWithoutFeedback>
              )
            })}
        </View>
        <View style={{flexDirection: 'row'}}>
          <View>
            {this._renderButton("Invite", () => {
              this.setState({visibleInviteModal: false,
                usernameSearchQuery: '', 
                userSearchResult: [],
                })
              if(this.state.selectedUserToInvite != ''){
                this.inviteUser()
              }
            
            })
            }
          </View>
          <View>
            {this._renderButton("Close", () => {
              this.setState({visibleInviteModal: false, 
                usernameSearchQuery: '', 
                userSearchResult: [],
                selectedUserToInvite: '',
              })
            })}
          </View>
        </View>
      </View>
    )

  _renderGroupNotesModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      {this._renderButton("Group by tag", () => {
        this.groupNotesByTag()
        this.setState({ visibleGroupNotesModal: false })
      })}
      {this._renderButton("Group by color", () => {
        this.groupNotesByColor()
        this.setState({ visibleGroupNotesModal: false })
      })}
      {this._renderButton("Spread notes", () => {
        this.spreadNotes()
        this.setState({ visibleGroupNotesModal: false })
      })}
      {this._renderButton("Cancel", () => {
        this.setState({ visibleGroupNotesModal: false })
      })}
    </View>
  )


  render() {
    console.log('render')
    //console.log('noteSearchQuery: '+this.state.noteSearchQuery)
    if(this.state.currentLoad >= this.totalLoad || (this.state.currentLoad >= this.totalLoad - 1 && this.state.startedBoard == 0)){
      return (
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <Modal isVisible={this.state.visibleNewNoteModal}>
              {this._renderNewNoteModal()}
            </Modal>
            <Modal isVisible={this.state.visibleSelectTagsModal}>
              {this._renderSelectTagsModal()}
            </Modal>
            <Modal isVisible={this.state.visibleShowMembersModal}>
              {this._renderShowMembersModal()}
            </Modal>
            <Modal isVisible={this.state.visibleInviteModal}>
              {this._renderInviteModal()}
            </Modal>
            <Modal isVisible={this.state.visibleGroupNotesModal}>
              {this._renderGroupNotesModal()}
            </Modal>
            <View style = {{
              //flex: 3
            }}>
            <ScrollView keyboardShouldPersistTaps = {'always'}  scrollEnabled = {true}>
              <View style={{
                //flex: 1, 
                flexDirection: 'row', 
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 0.5,
              }}>
                  <View style={{ 
                    marginVertical: 5, 
                    marginHorizontal: 20,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <TouchableWithoutFeedback
                    onPress={() => this.openNewNoteModal()}
                    >
                        <Image 
                          style={{width: 24, height: 24, marginVertical: 5, marginHorizontal: 10}}
                          source={require('../img/write.png')}
                        />
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={{ 
                    marginVertical: 5, 
                    marginHorizontal: 20,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <TouchableWithoutFeedback
                      onPress={() => {this.setState({visibleShowMembersModal: true})}}
                    >
                      <Image 
                        style={{width: 24, height: 24, marginVertical: 5, marginHorizontal: 10}}
                        source={require('../img/members.png')}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={{
                    flex: 1,
                    marginVertical: 5, 
                    marginHorizontal: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <TouchableWithoutFeedback
                      onPress={() => this.toBoardManager()}
                    >
                      <Image 
                        style={{width: 24, height: 24, marginVertical: 5, marginHorizontal: 10}}
                        source={require('../img/setting.png')}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={{ 
                    marginVertical: 5, 
                    marginHorizontal: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                    //flex: 1 
                  }}>
                    <TouchableWithoutFeedback
                      onPress={() => this.exitBoard()}
                    >
                      <View>
                        <Text style = {{fontSize: 20, color: 'black', marginVertical: 5, marginHorizontal: 10, alignItems: 'center'}}>
                          Exit
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View> 
                  
              </View>
            
              <View style={{
                //flex: 1, 
                flexDirection: 'row', 
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 0.5,
              }}>
                <View style={{ 
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                  }}>
                    <Text style = {{fontSize: 20, color: 'black'}}>
                      {this.state.board.mode != 'timing'?  '' : (this.state.timeRemaining == 0? 'Time\'s up' : this.state.timeRemaining)}
                    </Text>
                </View>
                <View style = {{flex: 1}}/>
                 <View style={{ 
                    //marginVertical: 10, 
                    //marginHorizontal: 20,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TouchableWithoutFeedback
                      onPress={() => this.setState({visibleGroupNotesModal: true})}
                    >
                      <View style = {{
                        backgroundColor: 'lightblue',
                        borderRadius: 10,
                      }}>
                        <Text style = {{fontSize: 14, color: 'black', marginVertical: 5, marginHorizontal: 10, alignItems: 'center'}}>
                          Function
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>  
                <View style={{ 
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1 
                  }}>
                    {
                          !this.state.startedBoard && this.state.board.mode == 'timing' 
                          &&  <TouchableWithoutFeedback
                                onPress={() => {
                                  this.startBoard()
                                  this.getBoardStartStatus()
                                }}
                              >
                                <View style ={{
                                  backgroundColor: 'lightblue',
                                  borderRadius: 10,
                                }}>
                                  <Text style = {{fontSize: 14, color: 'black', marginVertical: 5, marginHorizontal: 10, alignItems: 'center'}}>
                                    {this.state.startButtonText}
                                  </Text>
                                </View>
                              </TouchableWithoutFeedback>
                    }
                </View>  
              </View>
            </ScrollView>
            </View>
            <View style={{
              //height: 500,
              flex: 1,
              //borderColor: 'black',
              //borderWidth: 0.5,
            }}>
              <ScrollView 
                onScroll = {event => {
                  /*console.log('Y: '+event.nativeEvent.contentOffset.y);
   
                  console.log('currentBoardSize: '+this.currentBoardWidth+' '+this.currentBoardHeight)
                  if(this.currentBoardWidth == 0 && this.currentBoardHeight == 0){
                    console.log(JSON.stringify(event.nativeEvent.layoutMeasurement))
                    this.currentBoardHeight = event.nativeEvent.layoutMeasurement.height;
                    this.currentBoardWidth = event.nativeEvent.layoutMeasurement.width;  
                  }*/
                }}
                showsVerticalScrollIndicator = {true} 
                keyboardShouldPersistTaps = {'always'}
                style={{

                }}>
                  <View style=
                  {{
                    flex: 1,
                    width: 5,
                    height: boardHeight,
                  }}>

                  </View>
                  <ScrollView 
                    onScroll =  { event => {
                      /*console.log('X: '+event.nativeEvent.contentOffset.x);
       
                      console.log('currentBoardSize: '+this.currentBoardWidth+' '+this.currentBoardHeight)
                      if(this.currentBoardWidth == 0 && this.currentBoardHeight == 0){
                        console.log(JSON.stringify(event.nativeEvent.layoutMeasurement))
                        this.currentBoardHeight = event.nativeEvent.layoutMeasurement.height;
                        this.currentBoardWidth = event.nativeEvent.layoutMeasurement.width;  
                      }*/
                    }}
                    horizontal = {true}
                    showsHorizontalScrollIndicator = {true}
                    keyboardShouldPersistTaps = {'always'} 
                    style = {{
                      backgroundColor: 'white',
                      top: 0, 
                      bottom: 0,
                      position: 'absolute',
                    }}>
                    <View style={{flexDirection: 'column'}}>
                      <View style={{
                        //top: 0, 
                        //bottom: 0,
                        width: boardWidth,
                        height: 5,
                        //position: 'absolute',
                      }}>
                      </View>
                      <Text style={{fontSize:16}}></Text>
                    
                      {this.state.noteList.map((note) => {
                        //console.log('single note: '+JSON.stringify(note))
                        if((note.text).includes(this.state.noteSearchQuery)){
                          return(
                          //<DoubleClick onClick={this.handleClick}>
                            <Note 
                              deleteNote = {this.deleteNote} 
                              focusNote = {this.focusNote}
                              updateNotePosition = {this.updateNotePosition}
                              updateNoteText = {this.updateNoteText}
                              updateNoteList = {this.updateNoteList}
                              updateNoteColor = {this.updateNoteColor}
                              updateNote = {this.updateNote}
                              getState = {this.getState}
                              setVisibleOpenNoteModal = {this.setVisibleOpenNoteModal}
                              getVoteStatus = {this.getVoteStatus}
                              voteNote = {this.voteNote}
                              unvoteNote = {this.unvoteNote}
                              getLastPress = {this.getLastPress}
                              setLastPress = {this.setLastPress}
                              key = {note._id}
                              id = {note._id}
                              x = {note.x} 
                              y = {note.y} 
                              color = {note.color}
                              //color = {(note.text).includes(this.state.noteSearchQuery)? 'red' : 'black'} 
                              text = {note.text}
                              tags = {note.tags}/>
                          //</DoubleClick>
                          )
                        }
                      })}
                    </View>
                  </ScrollView>
              </ScrollView>
            </View>
            <View style={{
              //flex: 2,
              height: 75, 
              flexDirection: 'row', 
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 0.5,
            }}>
              <View style = {{flex: 2, flexDirection: 'row'}}>
                <View style = {{flex: 1}}> 
                  {this._renderTextInput('Search Note', 
                    (noteSearchQuery) => { this.setState({noteSearchQuery})},
                    this.state.noteSearchQuery
                  )}
                  <View style = {{marginLeft: 5}}>
                    <Text style = {{fontSize: 16, color: 'black',}}>Votes: {this.state.board.numberOfVote - this.state.votedNoteList.length}</Text>
                  </View>
                </View>
                <View style = {{flex: 1}}>
                  <TouchableWithoutFeedback
                    onPress={() => this.searchNote()}
                  >
                   <Image 
                        style={{width: 16, height: 16, marginTop: 8, marginHorizontal: 10}}
                        source={require('../img/search.png')}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style = {{flex: 0.7}}>
                   <View style = {{ 
                      top: 0, 
                      bottom: 0,
                      position: 'absolute',
                      width: 200,
                      //height: 150,
                      borderColor: 'gray',
                      borderWidth: 0.5,
                    }}>

                      {this.state.noteList.map((note) => {
                          //console.log('single note: '+JSON.stringify(note))
                          if((note.text).includes(this.state.noteSearchQuery)){
                            return(
                            //<DoubleClick onClick={this.handleClick}>
                              <SmallNote
                                deleteNote = {this.deleteNote} 
                                focusNote = {this.focusNote}
                                updateNotePosition = {this.updateNotePosition}
                                updateNoteText = {this.updateNoteText}
                                updateNoteList = {this.updateNoteList}
                                updateNoteColor = {this.updateNoteColor}
                                updateNote = {this.updateNote}
                                getState = {this.getState}
                                setVisibleOpenNoteModal = {this.setVisibleOpenNoteModal}
                                key = {note._id}
                                id = {note._id}
                                x = {note.x/10} 
                                y = {note.y/10} 
                                color = {note.color}
                                //color = {(note.text).includes(this.state.noteSearchQuery)? 'red' : 'black'} 
                                text = {note.text}
                                tags = {note.tags}/>
                            //</DoubleClick>
                            )
                          }
                        })}
                  </View>
                </View>
            </View>
         
        </View>
      );
    }
    else {
      return(
        <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white',}}/>
      )
    }
  }
}

/*
 <View style={{flex: 9, backgroundColor: 'white'}}>
 </View>
<Text style={{fontSize:96}}>Scroll me plz</Text>
*/

export default BoardScreen;

//<Note x = {0} y = {0} color = '#ffff99'/>