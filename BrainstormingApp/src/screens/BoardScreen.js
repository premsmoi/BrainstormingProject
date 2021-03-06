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
  TouchableHighlight,
  Picker,
} from 'react-native';
import styles from "./../app.style";
import {
  noteColor,
  borderColor,
  navBarColor,
} from './../colors'
import ImagePicker from 'react-native-image-picker';
import Modal from "react-native-modal";
import {
  StackNavigator,
  NavigationActions
} from 'react-navigation';
import Note from './../components/Note';
import SmallNote from './../components/SmallNote';
import {
  ip,
  scale,
  boardWidth,
  boardHeight
} from './../Configuration';
import {renderButton, renderIconButton} from './../RenderUtilities'
import App from '../App'
//import DoubleClick from 'react-native-double-click';

import io from 'socket.io-client';

//const ip = '10.0.2.2:8080'
//const ip = '192.168.43.143:8080'
const socket = io(ip);
//import IO from 'socket.io-client/socket.io';

class BoardScreen extends Component {

  constructor(props) {
    super(props);
    this.boardId = this.props.navigation.state.params.boardId;
    this.newId = 2;
    this.tempNote = null;
    this.totalLoad = 6;
    this.lastPressObj = {
      time: new Date().getTime(),
      noteId: null,
    }
    this.exitThisBoard = false;
    this.currentBoardWidth = 0;
    this.currentBoardHeight = 0;
    this.pressExit = false;
    this.state = {
      startButtonText: 'Start',
      startedBoard: '',
      timeRemaining: null,
      numberOfVote: null,
      currentLoad: 0,
      noteList: [],
      votedNoteList: [],
      visibleNewNoteModal: false,
      visibleEditNoteModal: false,
      visibleSelectTagsModal: false,
      visibleShowMembersModal: false,
      visibleInviteModal: false,
      visibleGroupNotesModal: false,
      visibleMemberDetail: false,
      newColor: 'red',
      newNoteText: '',
      newNoteTags: [],
      newNoteType: 'text',
      newTagSelection: {},
      newImgData: '',
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
      currentDetailMember: '',
    }
    this.isVisibleOpenNoteModal = false;
    /*this.deleteNote = this.deleteNote.bind(this);
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
    this.setLastPress = this.setLastPress.bind(this);*/
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
    this.ws = App.getAppWebSocket()

    this.ws.onmessage = (e) => {
      // a message was received
      //console.log("e.data: "+e.data);
      var obj = JSON.parse(e.data)
      //console.log(obj.body.notes)

      if (obj.body.code == 'getBoard') {
        console.log('I got board')
        this.setState({currentLoad: ++this.state.currentLoad})
        App.setAppBoard(obj.body.board)

        this.setState({
          timeRemaining: obj.body.board.timeRemaining
        })
        this.getNotes();
      }

      if (obj.body.code == 'getNotesTrigger') {
        console.log('I got notes trigger')
        this.getNotes();
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

      if (obj.body.code == 'getTimeRemaining') {
        console.log('I got timer')
        this.setState({
          timeRemaining: obj.body.timeRemaining,
          currentLoad: ++this.state.currentLoad,
        })
        
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

    
      console.log('This is Board Screen!')
      
      //ws.send('Hello Node Server!'); // send a message
      var tagClientRequest = {
        from: 'Board',
        code: 'tagBoard',
        username: App.getAppUser().username,
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(tagClientRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)
      //console.log('req: ' + requestString)

      var getTagsRequest = {
        from: 'Board',
        code: 'boardGetTags',
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(getTagsRequest)
      this.ws.send(requestString)

      var enterBoardRequest = {
        from: 'Board',
        code: 'enterBoard',
        username: App.getAppUser().username,
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(enterBoardRequest)
      this.ws.send(requestString)

      var boardGetTimerRequest = {
        from: 'Board',
        code: 'getTimeRemaining',
        username: App.getAppUser().username,
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(boardGetTimerRequest)
      this.ws.send(requestString)

      var getBoardRequest = {
        from: 'Board',
        code: 'getBoard',
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(getBoardRequest)
      this.ws.send(requestString)

      var getVoteRequest = {
        from: 'Board',
        code: 'getVote',
        username: App.getAppUser().username,
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(getVoteRequest)
      this.ws.send(requestString)

      var getUserVotedNotesRequest = {
        from: 'Board',
        code: 'getUserVotedNotes',
        username: App.getAppUser().username,
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(getUserVotedNotesRequest)
      this.ws.send(requestString)

      this.getBoardStartStatus()

    setInterval(this.countTimer, 1000)

  }

  getLastPress = () => {
    return this.lastPressObj;
  };

  setLastPress = (obj) => {
   this.lastPressObj = obj
  };

  getUser = () => {
    return this.user;
  };

  toBoardManager = () => {
    this.props.navigation.navigate('BoardManager')
  };

  openNewNoteModal = () => {
    this.setState({
      visibleNewNoteModal: true
    })
  };

  openShowMembersModal = () => {
    this.setState({
      visibleShowMembersModal: true,
    })
  };

  getTimeRemaining = () => {
    console.log('timeRemaining: ' + this.state.timeRemaining)
  };


  getState = () => {
    return this.state
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    this.exitBoard()
    return true;
  };

  setVisibleOpenNoteModal = (bool) => {
    this.isVisibleOpenNoteModal = bool;
  };


  countTimer  = () => {
    if (this.state.currentLoad >= this.totalLoad && !this.exitThisBoard) {

      if(this.state.timeRemaining == 0){
        console.log(1)
        this.updateBoard({
          timeRemaining: App.getAppBoard().limitedTime,
        })
      }

      /*if (App.getAppBoard().timeRemaining != App.getAppBoard().limitedTime) {
        if (!App.getAppBoard().start) {
          console.log(2)
          this.updateBoard({
            timeRemaining: App.getAppBoard().limitedTime
          })
        }
      }*/
      //console.log('startedBoard: '+this.state.startedBoard)

      if (App.getAppBoard().start && this.state.timeRemaining > 0) {
        var boardGetTimerRequest = {
          from: 'Board',
          code: 'getTimeRemaining',
          username: App.getAppUser().username,
          boardId: this.boardId,
        }
        var requestString = JSON.stringify(boardGetTimerRequest)
        this.ws.send(requestString)
        console.log('count timer')
      }

    }
  };

  updateBoard = (updatedObj) => {
    var updateBoardRequest = {
        from: 'Board',
        code: 'updateBoard',
        boardId: this.boardId,
        updatedObj: updatedObj,
      }
      var requestString = JSON.stringify(updateBoardRequest)
      this.ws.send(requestString)
  };

  searchUsername = () => {
    var searchUserRequest = {
      from: 'Board',
      code: 'searchUser',
      username: this.state.usernameSearchQuery,
      boardId: this.boardId
    }
    var requestString = JSON.stringify(searchUserRequest)
    console.log('Search User Request')
    this.ws.send(requestString)
  };

  inviteUser = () => {
    var inviteUserRequest = {
      from: 'Board',
      code: 'inviteUser',
      username: this.state.selectedUserToInvite,
      boardId: this.boardId,
      boardName: App.getAppBoard().boardName,
    }
    var requestString = JSON.stringify(inviteUserRequest)
    console.log('Invite User Request')
    this.ws.send(requestString)
    //this.getMembers()
    this.setState({
      selectedUserToInvite: '',
    })
  };

  getBoardStartStatus = () => {
    var getBoardStartStatusRequest = {
      from: 'Board',
      code: 'getBoardStartStatus',
      username: App.getAppUser().username,
      boardId: this.boardId,
    }
    var requestString = JSON.stringify(getBoardStartStatusRequest)
    this.ws.send(requestString)
  };

  getNotes = () => {
    var getNotesRequest = {
      from: 'Board',
      code: 'getNotes',
      boardId: this.boardId,
    }
    var requestString = JSON.stringify(getNotesRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  };

  updateNote = (updatedObj) => {
    var newNoteRequest = {
      from: 'Board',
      code: 'updateNote',
      updatedObj: updatedObj,
    }
    var requestString = JSON.stringify(newNoteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  };

  updateNoteList = () => {
    var noteIdList = [];
    this.state.noteList.forEach(function(note){

    })
    var newNoteRequest = {
      from: 'Board',
      code: 'updateNoteList',
      boardId: this.boardId,
      newNoteList: this.state.noteList,
    }
    var requestString = JSON.stringify(newNoteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  };

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
  };

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
      boardId: this.boardId,
      writer: App.getAppUser().username,
      x: 100,
      y: 200,
      color: this.state.newColor,
      noteType: this.state.newNoteType,
      img: {
        data: this.state.newImgData,
        contentType: 'img/jpg'
      },
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
  };

  deleteNote = (deletedId) => {
    var deleteNoteRequest = {
      from: 'Board',
      code: 'deleteNote',
      noteId: deletedId,
      boardId: this.boardId,
    }
    var requestString = JSON.stringify(deleteNoteRequest)
    console.log('delete')
    this.ws.send(requestString)
    this.getNotes()
  };

  exitBoard = () => {
    if(!this.pressExit){
      var exitBoardRequest = {
        from: 'Board',
        code: 'exitBoard',
        username: App.getAppUser().username,
        boardId: this.boardId,
      }
      var requestString = JSON.stringify(exitBoardRequest)
      console.log('exitBoard')
      this.ws.send(requestString)
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })],
      });
      this.props.navigation.dispatch(resetAction);
      //this.props.navigation.goBack()
      this.pressExit = true;
      this.exitThisBoard = true;
    }
  };

  startBoard = () => {
    var starttBoardRequest = {
      from: 'Board',
      code: 'updateBoard',
      boardId: this.boardId,
      updatedObj: {
        start: true,
      }
    }
    var requestString = JSON.stringify(starttBoardRequest)
    console.log('Start Board !!!')
    this.ws.send(requestString)
    this.setState({startButtonText: 'Stop'})
  };

  stopBoard = () => {
    var stopBoardRequest = {
      from: 'Board',
      code: 'updateBoard',
      boardId: this.boardId,
      updatedObj: {
        start: false,
      }
    }
    var requestString = JSON.stringify(stopBoardRequest)
    console.log('Stop Board !!!')
    this.ws.send(requestString)
    this.setState({startButtonText: 'Start'})
  };

  reRenderByNotes = (newNoteList) => {
    this.setState({
      noteList: newNoteList
    })
  };

  groupNotesByTag = () => {
    //console.log('tags: '+JSON.stringify(this.state.tags))
    var newNoteList = this.state.noteList
    var x = -150*scale;
    var y = 0;
    var count = 0
    var maxY = 150*scale
    this.state.tags.map((tag) => {
      x += 175*scale;
      y  = Math.floor(count/5)*maxY + 50*scale;
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
          y += 40*scale;
          x += 10*scale
          includesNote = true;
          if(y + 150*scale > maxY){
            maxY = y + 150*scale;
          }
        }
      })
      if(includesNote){
        count++
        if(count % 5 == 0){
          x = -150*scale;
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
  };

  groupNotesByColor = () => {
    //console.log('tags: '+JSON.stringify(this.state.tags))
    var colors = ['red','pink','blue','green','yellow']
    var newNoteList = this.state.noteList
    var x = -150*scale;
    var y;
    colors.map((color) => {
      x += 175*scale;
      y  = 50*scale;
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
          x += 10*scale;
          y += 40*scale;
          count_note++
        }
      })
      if(count_note == 0){
        x -= 175*scale
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
  };

  spreadNotes = () => {
    //console.log('tags: '+JSON.stringify(this.state.tags))
    var newNoteList = this.state.noteList
    var x = -150*scale;
    var y = 25*scale;
    count_note = 0;
    newNoteList.map((note) => {
      x += 190*scale;
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
      if (count_note % 5 == 0) {
        x = -150*scale;
        y += 175*scale;
      }
    })
    this.setState({
      noteList: []
    }, () => {
      this.setState({
        noteList: newNoteList
      }, () => {
        this.updateNoteList()
      })
    })
  };

  getVoteStatus = (noteId) => {
    if(this.state.votedNoteList.includes(noteId)){
      return true;
    }
    else
      return false;
  };

  voteNote = (noteId) => {
    var voteNoteRequest = {
      from: 'Board',
      code: 'voteNote',
      username: App.getAppUser().username,
      boardId: this.boardId,
      votedNoteId: noteId,
    }
    var requestString = JSON.stringify(voteNoteRequest)
    this.ws.send(requestString)
  };

  unvoteNote = (noteId) => {
    var unvoteNoteRequest = {
      from: 'Board',
      code: 'unvoteNote',
      username: App.getAppUser().username,
      boardId: this.boardId,
      unvotedNoteId: noteId,
    }
    var requestString = JSON.stringify(unvoteNoteRequest)
    this.ws.send(requestString)
  };

  uploadPicture = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    //this.setState({imgData: null})
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: 'data:image/jpg;base64,'+response.data };
        console.log('data: '+String(response.data))
        this.setState({
          newImgData: response.data, 
        });
      }
    });
  };

  _renderColorPicker = (color) => (
    <TouchableOpacity onPress={() => this.setState({newColor: color})}>
      <View style={{
        backgroundColor: noteColor[color],
        borderColor: 'black',
        borderWidth: 0.5,
        width: 50*scale,
        height: 50*scale,}}>
      </View>
    </TouchableOpacity>
  );

  _renderTextInput = (placeholder, onChange, value) => (
    <View>
      <TextInput
          style={{
            height: 36*scale,
            width: 100*scale,
            fontSize: 14*scale
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
          value = {value}
      />
    </View>
  );

  _renderNewNoteModal = () => (
    <View style={{
      backgroundColor: noteColor[this.state.newColor],
      padding: 22*scale,
      //justifyContent: "center",
      //alignItems: "center",
      borderRadius: 4*scale,
    }}>
      <View style={{flexDirection: 'row', padding: 6, margin: 8, justifyContent: 'center'}}>
        {this._renderColorPicker('red')}
        {this._renderColorPicker('pink')}
        {this._renderColorPicker('green')}
        {this._renderColorPicker('blue')}
        {this._renderColorPicker('yellow')}
      </View>
      <View style={{flexDirection: 'row', padding: 6, margin: 8}}>
        <Text style = {{
          fontSize: 14*scale,
        }}>
          Type: 
        </Text>
        <Picker
          selectedValue={this.state.newNoteType}
          style={{ height: 20*scale, width: 150*scale, }}
          onValueChange={(newNoteType) => this.setState({newNoteType})}>
          <Picker.Item label="Text" value="text" />
          <Picker.Item label="Image" value="image" />
        </Picker>
      </View>
      <View>
        {
          this.state.newNoteType == 'text' && (
              <TextInput
                style={{ 
                  fontSize: 20*scale,
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
            )
        }
        {
          this.state.newNoteType == 'image' && (
            <View style = {{marginHorizontal: 15}}>
                <Image style={{ width: 250*scale, height: 250*scale }} source={{uri: 'data:image/jpg;base64,'+this.state.newImgData}} />
              </View>
            )
        }
        
      </View>
      <View style = {{flexDirection: 'row'}} >
        <Text 
          style={{
            fontSize: 16*scale, 
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
                    fontSize: 16*scale, 
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
              style={{width: 16*scale, height: 16*scale, marginTop: 8, marginLeft: 5}}
              source={require('../../img/pencil.png')}
            />
          </TouchableOpacity>
      </View>
      {
        this.state.newNoteType == 'image' && (
          <View style = {{flexDirection: 'row', padding: 5}}>
            <View style = {{flex: 1}}/>
            <View style = {{flex: 8}}>
            {
              renderButton('Uplaod Image', () => this.uploadPicture())
            }
            </View>
            <View style = {{flex: 1}}/>          
          </View>
        )
      }
      <View style={{flexDirection: 'row', padding: 5,}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {renderButton("OK", () => {
            this.setState({ visibleNewNoteModal: false })
            this.setState({newTagSelection: {}, newNoteTags: [], newNoteText:''})
            this.createNewNote()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {renderButton("Cancel", () => {
            this.setState({ visibleNewNoteModal: false })
            this.setState({newTagSelection: {}, newNoteTags: [], newNoteText:''})
          })}
        </View>
        <View style = {{flex: 1}}/>
      </View>
    </View>
  );

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
          <View style={{ flexDirection: 'row' }}
            key = {tag}
          >
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
            <Text style={{fontSize: 16*scale}}>{tag}</Text>
          </View>
        )
      })}
      {renderButton("OK", () => {
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
  );

  _renderShowMembersModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      <View style = {{
        flexDirection:'row',
        justifyContent: 'space-between'
      }}>
        <View style = {{

        }}>
          <Text style={{
            fontSize: 20*scale, 
            color: 'grey',  
            marginVertical: 5, 
            //marginHorizontal: 20 
          }}>
            {'Members('+this.state.members.length+')'}
          </Text>
        </View>
        <View style = {{
         
        }}>
          <TouchableWithoutFeedback
            onPress={() => this.setState({visibleInviteModal: true})}
          >
            <View style = {{
              marginVertical: 10, 
              marginHorizontal: 10,
            }}>    
              <Text style={{
                fontSize: 16*scale, 
                color: '#70cdef', 
              }}>
                Invite
              </Text>
             </View> 
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style = {{
        marginLeft: 10,
      }}>
          {this.state.members.map((user) => {
            return(
              <TouchableHighlight
                onPress = { () => this.setState({visibleMemberDetail: true, currentDetailMember: user.username})}
                underlayColor = {'#f2f2f2'}
                key = {user.username} 
              >
                <View 
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                  }} 
                  
                >
                  <View style={{}}>
                    <Text 
                      style={{
                        fontSize: 18*scale, 
                        color: 'black', 
                      }}>
                        {user.username + (user.username == App.getAppBoard().facilitator? ' (facilitator)':'')}
                    </Text>
                  </View>
                  <View style={{
                    marginHorizontal: 10,
                  }}>
                    <Text 
                      style={{
                        fontSize: 18*scale, 
                        color: user.currentBoard == this.boardId? 'green' : 'red',  
                      }}>
                        {user.currentBoard == this.boardId? 'online' : 'offline'}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>  
            )
          })}
      </View>
      <View style = {{
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
      }}>
        {renderButton("OK", () => {
          this.setState({ visibleShowMembersModal: false })
        })}
      </View>
    </View>
  );

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
            <Text style={{fontSize: 16*scale, textAlign: 'center'}}>Search username : </Text>
          </View>
          {this._renderTextInput('Search Input', 
            (usernameSearchQuery) => { this.setState({usernameSearchQuery})},
            this.state.usernameSearchQuery
          )}
          <View>
            {renderButton("Search", () => {this.searchUsername()})}
          </View>
        </View>
        <View style={{height: 250*scale}}>
          <ScrollView>
            {this.state.userSearchResult.map((user) => {
              return(
                  <TouchableWithoutFeedback
                    onPress = {() => {
                      user.joined == true? 
                      this.setState({selectedUserToInvite: ''}) : this.setState({selectedUserToInvite: user.username})
                    }}
                    key = {user.username+user.name}
                  >
                    <View style = {{flexDirection: 'row', backgroundColor: user.username==this.state.selectedUserToInvite && user.joined == false? 
                      'lightblue':'white'}}>
                      <Text 
                        style={{
                          fontSize: 16*scale, 
                          color: 'black',  
                          marginVertical: 4, 
                          marginHorizontal: 8 
                        }}
                      >
                          {user.name}
                      </Text>
                      <Text 
                        style={{
                          fontSize: 16*scale, 
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
          </ScrollView>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View>
            {renderButton("Invite", () => {
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
            {renderButton("Close", () => {
              this.setState({visibleInviteModal: false, 
                usernameSearchQuery: '', 
                userSearchResult: [],
                selectedUserToInvite: '',
              })
            })}
          </View>
        </View>
      </View>
    );

  _renderGroupNotesModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      //borderRadius: 4,
    }}>
      <View style = {{
        marginVertical: 10,
        marginHorizontal: 20,
      }}>
        {renderButton("Group by tag", () => {
          this.groupNotesByTag()
          this.setState({ visibleGroupNotesModal: false })
        })}
      </View>
      <View style = {{
        marginVertical: 10,
        marginHorizontal: 20,
      }}>
        {renderButton("Group by color", () => {
          this.groupNotesByColor()
          this.setState({ visibleGroupNotesModal: false })
        })}
      </View>
      <View style = {{
        marginVertical: 10,
        marginHorizontal: 20,
      }}>
        {renderButton("Spread notes", () => {
          this.spreadNotes()
          this.setState({ visibleGroupNotesModal: false })
        })}
      </View>
      <View style = {{
        marginVertical: 10,
        marginHorizontal: 20,
      }}>
        {renderButton("Cancel", () => {
          this.setState({ visibleGroupNotesModal: false })
        })}
      </View>
    </View>
  );

  _renderMemberDetailModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      //borderRadius: 4,
    }}>
      <View style = {{
        marginVertical: 5,
      }}>
        {
          App.getAppUser().username == App.getAppBoard().facilitator && renderButton('Set Facilitator', () => {
            this.updateBoard({ facilitator: this.state.currentDetailMember })
            this.setState({visibleMemberDetail: false})
          })
        }
      </View>
      <View style = {{
        marginVertical: 5,
      }}>
        {
          renderButton('Close', () => this.setState({visibleMemberDetail: false}))  
        } 
        </View>
    </View>
  )


  render() {
    console.log('render')
   //console.log(new Date().getTime())
    //console.log('noteSearchQuery: '+this.state.noteSearchQuery)
    if(this.state.currentLoad >= this.totalLoad ){
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
            <Modal isVisible={this.state.visibleMemberDetail}>
              {this._renderMemberDetailModal()}
            </Modal>
            <View style = {{
              //flex: 3
            }}>
            <ScrollView keyboardShouldPersistTaps = {'always'}  scrollEnabled = {true}>
              <View style={{
                backgroundColor: navBarColor,
                flexDirection: 'row',
                borderColor: 'black',
                borderWidth: 0.5,
              }}>
                  <View style={{ 
                    marginVertical: 5, 
                    flex: 1,
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>{
                    renderIconButton(require('../../img/write.png'), () => this.openNewNoteModal())
                  }
                  </View>
                  <View style={{ 
                    marginVertical: 5, 
                    marginHorizontal: 10,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {
                      renderIconButton(require('../../img/members.png'), () => this.setState({visibleShowMembersModal: true}))
                    }
                  </View>
                  <View style={{
                    flex: 1,
                    marginVertical: 5, 
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {
                      renderIconButton(require('../../img/setting.png'), () => this.toBoardManager())
                    }
                  </View>
                  <View style={{ 
                    marginVertical: 5, 
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1 
                  }}>
                    <TouchableWithoutFeedback
                      onPressIn={() => this.exitBoard()}
                    >
                      <View>
                        <Text style = {{fontSize: 20*scale, color: 'black', marginVertical: 5, marginHorizontal: 5, alignItems: 'center'}}>
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
                    flex: 2
                  }}>
                    <View style = {{flexDirection: 'row'}}>
                      <Text style = {{fontSize: 16*scale, color: 'gray', marginTop: 3}}>
                        {App.getAppBoard().hasTime?  (this.state.timeRemaining == 0? '' : 'Time Remaining:') : ''}
                      </Text>
                      <Text style = {{fontSize: 20*scale, color: 'black', marginHorizontal: 5}}>
                        {App.getAppBoard().hasTime?  (this.state.timeRemaining == 0? 'Time\'s up' : this.state.timeRemaining) : ''}
                      </Text>
                    </View>
                </View>
                 <View style={{ 
                    //marginVertical: 10, 
                    //marginHorizontal: 20,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {
                      renderButton('Function', () => this.setState({visibleGroupNotesModal: true}))  
                    }
                  </View>  
                <View style={{ 
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1 
                  }}>
                    {
                          !App.getAppBoard().start && App.getAppBoard().hasTime 
                          &&  renderButton('Start', () => this.startBoard())
                    }
                    {
                          App.getAppBoard().start && App.getAppBoard().hasTime 
                          &&  renderButton('Stop', () => this.stopBoard())
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
                      {this.state.noteList.map((note) => {
                        //console.log('single note: '+JSON.stringify(note))
                        if( ((note.text).includes(this.state.noteSearchQuery) && note.noteType == 'text') || note.noteType == 'image' ){
                          return(
                          //<DoubleClick onClick={this.handleClick}>
                            <View key = {note._id}>
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
                                id = {note._id}
                                x = {note.x} 
                                y = {note.y} 
                                writer = {note.writer}
                                color = {note.color}
                                voteScore = {note.voteScore}
                                noteType = {note.noteType}
                                text = {note.text}
                                img = {note.img}
                                tags = {note.tags}/>
                              </View>
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
              height: boardHeight*scale/10, 
              flexDirection: 'row', 
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 0.5,
            }}>
              <View style = {{flex: 2, flexDirection: 'row'}}>
                <View style = {{flex: 1}}>
                  <TextInput
                    style = {{
                      height: 36*scale,
                      width: 100*scale,
                      fontSize: 16*scale,
                    }}
                    placeholderTextColor = 'gray'
                    placeholder = 'Search Note'
                    onChangeText = {(noteSearchQuery) => { this.setState({noteSearchQuery})}}
                    value = {this.state.noteSearchQuery}
                    maxLength = {100}
                    textAlign = {'left'}
                    underlineColorAndroid = {'black'}
                  />
                  <View style = {{marginLeft: 5}}>
                    <Text style = {{fontSize: 16*scale, color: 'black',}}>Votes: {App.getAppBoard().numberOfVote - this.state.votedNoteList.length}</Text>
                  </View>
                </View>
                <View style = {{flex: 1}}>
                </View>
              </View>
              <View style = {{
                flex: 0.7, 
                flexDirection: 'row', 
                justifyContent: 'flex-end'
              }}>
                   <View style = {{ 
                      top: 0, 
                      bottom: 0,
                      position: 'absolute',
                      width: boardWidth*scale/10,
                      backgroundColor: 'white',
                      //height: 150,
                      borderColor: 'gray',
                      borderWidth: 0.5,
                    }}>

                      {this.state.noteList.map((note) => {
                          //console.log('single note: '+JSON.stringify(note))
                          if(((note.text).includes(this.state.noteSearchQuery) && note.noteType == 'text') || note.noteType == 'image'){
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
                                x = {note.x*scale/10} 
                                y = {note.y*scale/10} 
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
        <View style = {{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
        }}>
          <Text>Loading..</Text>
        </View>
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