import React, { Component } from 'react';
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
} from 'react-native';
import styles from "./app.style";
import {noteColor, borderColor} from './colors'
import Modal from "react-native-modal";
import { StackNavigator, NavigationActions } from 'react-navigation';
import Note from './Note';
import {ip} from './Configuration';

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
    this.state = {
      openWebSocket: false,
      boardName: '',
      startButtonText: 'Start',
      startedBoard: 0,
      timeRemaining: 0,
      //noteList : [ {id: 1, x: 0, y: 0, color: 'blue', text: 'My name is Smoi'},
      //             {id: 2, x: 100, y: 100, color: 'pink', text: 'Passakorn'} ],
      noteList: [],
      visibleNewNoteModal: false,
      visibleEditNoteModal: false,
      visibleSelectTagsModal: false,
      visibleShowMembersModal: false,
      newColor: 'red',
      newNoteText: '',
      tags: [],
      newNoteTags: [],
      tagSelection: {},
      userSearchResult: [],
      selectedUserToInvite: '',
      usernameSearchQuery: '',
      members: [],
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
    //console.log(this.props)

    //this.ws = new WebSocket('ws://10.0.2.2:8080', 'echo-protocol');
    this.ws = new WebSocket('ws://'+ip, 'echo-protocol');

    this.ws.onmessage = (e) => {
      // a message was received
      //console.log("e.data: "+e.data);
      var obj = JSON.parse(e.data)
      //console.log(obj.body.notes)
      if(obj.body.code == 'getNotes'){
        console.log('I got notes')
        this.getNotes();
      }

      if(obj.body.code == 'closeWebSocket'){
        console.log('closeWebSocket')
        this.ws.close()
      }

      if(obj.body.code == 'updatedNotes'){
        console.log('isVisibleOpenNoteModal: '+this.isVisibleOpenNoteModal)
        if(this.isVisibleOpenNoteModal==false){
          this.setState({noteList: []})
          this.setState({noteList: obj.body.notes})
          console.log('updated notes')
        }
      }

      if(obj.body.code == 'getTags'){
        this.setState({tags: obj.body.tags})
        console.log('tag: '+this.state.tags)
        this.state.tags.map((tag) => {
          let newTagSelection = this.state.tagSelection
          newTagSelection[tag] = false
          this.setState({ tagSelection: newTagSelection })
        })
      }


      if(obj.body.code == 'getMembers'){
        this.setState({members: obj.body.members})
        console.log('tag: '+this.state.tags)
        this.state.tags.map((tag) => {
          let newTagSelection = this.state.tagSelection
          newTagSelection[tag] = false
          this.setState({ tagSelection: newTagSelection })
        })
      }

      if(obj.body.code == 'getBoardStartStatus'){
        this.setState({startedBoard: obj.body.status})
      }

       if(obj.body.code == 'getTimer'){
        this.setState({timeRemaining: obj.body.timeRemaining})
      }
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    this.ws.onclose = (e) => {
      // connection closed
      this.setState({openWebSocket: false})
      console.log(e.code, e.reason);
      console.log('Closed!')
    };

    this.ws.onopen = () => {
      // connection opened
      this.setState({openWebSocket: true})
      this.getNotes();
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
      console.log('req: '+requestString)

      var getTagsRequest = {
        from: 'Board',
        code: 'boardGetTags',
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(getTagsRequest)
      this.ws.send(requestString)

      var getMembersRequest = {
        from: 'Board',
        code: 'getMembers',
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(getMembersRequest)
      this.ws.send(requestString)

      var enterBoardRequest = {
        from: 'Board',
        code: 'enterBoard',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(enterBoardRequest)
      this.ws.send(requestString)

      this.getBoardStartStatus()
    };

    setInterval(this.countTimer, 1000)

  }
    

  toBoardManager(){
    this.setState({openWebSocket:false})
    this.props.navigation.navigate(
                  'BoardManager', 
                  { user: this.props.navigation.state.params.user, 
                    boardId: this.props.navigation.state.params.boardId, 
                    boardName: this.props.navigation.state.params.boardName 
                  }
                )
                this.ws.close()
  }

  openNewNoteModal(){
    this.setState({visibleNewNoteModal: true})
  }

  openShowMembersModal() {
    this.setState({
      visibleShowMembersModal: true,
    })
  }

  getTimeRemaining(){
     console.log('timeRemaining: '+this.state.timeRemaining)
  }


  getState(){
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
    this.props.navigation.navigate('Home', { user: this.props.navigation.state.params.user })
    return true;
  }

  setVisibleOpenNoteModal(bool){
    this.isVisibleOpenNoteModal = bool;
  }


  countTimer(){
    //console.log('startedBoard: '+this.state.startedBoard)
    if(this.state.startedBoard == 1 && this.state.openWebSocket == true){
      var boardGetTimerRequest = {
        from: 'Board',
        code: 'boardGetTimer',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(boardGetTimerRequest)
      this.ws.send(requestString)
    }
  }

  async searchUsername(){
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

  async inviteUser(){
    var inviteUserRequest = {
        from: 'Board',
        code: 'inviteUser',
        username: this.state.selectedUserToInvite,
        boardId: this.props.navigation.state.params.boardId,
      }
    var requestString = JSON.stringify(inviteUserRequest)
    console.log('Invite User Request')
    this.ws.send(requestString)
    //this.getMembers()
    this.setState({selectedUserToInvite: '',})
  }

  getBoardStartStatus(){
     var getBoardStartStatusRequest = {
        from: 'Board',
        code: 'getBoardStartStatus',
        username: this.user.username,
        boardId: this.props.navigation.state.params.boardId,
      }
      var requestString = JSON.stringify(getBoardStartStatusRequest)
      this.ws.send(requestString)
  }

  boardGetTimer(){

  }

  getNotes(){
    var getNotesRequest = {
      from: 'Board',
      code: 'getNotes',
      boardId: this.props.navigation.state.params.boardId,
    }
    var requestString = JSON.stringify(getNotesRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  updateNote(updatedObj){
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

  updateNoteList(){
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
    var deletedNote = this.state.noteList.find(function(note) {return note._id == focusId})
    var deletedIndex = this.state.noteList.findIndex(function(note) {return note._id == focusId})
    //console.log('deletedIndex: '+deletedIndex)
    tempList.splice(deletedIndex, 1)
    tempList.push(deletedNote)
    this.setState({noteList: tempList})
    //this.updateNoteList();
  }

  createNewNote = () => {
    this.state.tags.map((tag) => {
      if(this.state.tagSelection[tag]){
          let newTags = this.state.newNoteTags
          newTags.push(tag)
          this.setState({newNoteTags: newTags})
      }
    })
    console.log('new tags: '+this.state.newNoteTags)
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
      return {noteList: newNoteList}
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

  exitBoard(){
    this.setState({openWebSocket:false})
    var exitBoardRequest = {
      from: 'Board',
      code: 'exitBoard',
      username: this.user.username,
      boardId: this.props.navigation.state.params.boardId, 
    }
    var requestString = JSON.stringify(exitBoardRequest)
    console.log('exitBoard')
    this.ws.send(requestString)
    this.props.navigation.navigate('Home', { user: this.props.navigation.state.params.user })
    //this.ws.close()
  }

  startBoard(){
    var starttBoardRequest = {
      from: 'Board',
      code: 'startBoard',
      username: this.user.username,
      boardId: this.props.navigation.state.params.boardId,
    }
    var requestString = JSON.stringify(starttBoardRequest)
    console.log('Start Board !!!')
    this.ws.send(requestString)
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
            if(this.state.tagSelection[tag]){
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
            this.setState({tagSelection: {}, newNoteTags: [], newNoteText:''})
            this.createNewNote()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => {
            this.setState({ visibleNewNoteModal: false })
            this.setState({tagSelection: {}, newNoteTags: [], newNoteText:''})
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
              value={this.state.tagSelection[tag]}
              onValueChange={() => {
                let newTagSelection = this.state.tagSelection
                newTagSelection[tag] = !newTagSelection[tag]
                this.setState({ tagSelection: newTagSelection })
                console.log(this.state.tagSelection)
              }
              }
            />
            <Text style={{marginTop: 5}}>{tag}</Text>
          </View>
        )
      })}
      {this._renderButton("OK", () => {
        this.setState({ visibleSelectTagsModal: false })
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
      <Text style={{fontSize: 20, 
            color: 'grey',  
            marginVertical: 5, 
            marginHorizontal: 20 
          }}>Members</Text>
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

  render() {
    console.log('render')
    return (
      
        <View style={{flex: 1}}>
          <Modal isVisible={this.state.visibleNewNoteModal}>
            {this._renderNewNoteModal()}
          </Modal>
          <Modal isVisible={this.state.visibleSelectTagsModal}>
            {this._renderSelectTagsModal()}
          </Modal>
          <Modal isVisible={this.state.visibleShowMembersModal}>
            {this._renderShowMembersModal()}
          </Modal>
          <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white',}}>
              <View style={{ 
                marginVertical: 10, 
                marginHorizontal: 20,
                flex: 1 
              }}>
                <TouchableWithoutFeedback
                onPress={() => this.openNewNoteModal()}
                >
                    <Image 
                      style={{width: 32, height: 32, marginTop: 8, marginHorizontal: 10}}
                      source={require('../img/write.png')}
                    />
                </TouchableWithoutFeedback>
              </View>
              <View style={{ 
                marginVertical: 10, 
                marginHorizontal: 20,
                flex: 1 
              }}>
                <TouchableWithoutFeedback
                  onPress={() => {this.setState({visibleShowMembersModal: true})}}
                >
                  <Image 
                    style={{width: 32, height: 32, marginTop: 8, marginHorizontal: 10}}
                    source={require('../img/members.png')}
                  />
                </TouchableWithoutFeedback>
              </View>
              <View style={{
                flex: 1,
                marginVertical: 10, 
                marginHorizontal: 20,
              }}>
                <TouchableWithoutFeedback
                  onPress={() => this.toBoardManager()}
                >
                  <Image 
                    style={{width: 32, height: 32, marginTop: 8, marginHorizontal: 10}}
                    source={require('../img/setting.png')}
                  />
                </TouchableWithoutFeedback>
              </View>
              <View style={{ 
                marginVertical: 10, 
                marginHorizontal: 20,
                //flex: 1 
              }}>
                <TouchableWithoutFeedback
                  onPress={() => this.exitBoard()}
                >
                  <View>
                    <Text style = {{fontSize: 25, color: 'black', marginTop: 8, marginHorizontal: 10, alignItems: 'center'}}>
                      Exit
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View> 
              
          </View>
          <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white',}}>
            <View style={{ 
                marginVertical: 10, 
                marginHorizontal: 20,
                //flex: 1 
              }}>
                <Text style = {{fontSize: 25, color: 'black', marginTop: 8, marginHorizontal: 10}}>
                  {this.state.timeRemaining}
                </Text>
            </View>
            <View style={{ 
              marginVertical: 10, 
              marginHorizontal: 20,
              flex: 2
            }}>
            </View>
            <View style={{ 
                marginVertical: 10, 
                marginHorizontal: 20,
                flex: 1 
              }}>
                {
                      !this.state.startedBoard && this._renderButton(this.state.startButtonText, () => {
                      this.startBoard()
                      this.getBoardStartStatus()
                      this.boardGetTimer()
                      })
                }
              </View>  
          </View>
          
          
          <View style={{flex: 9}}>
            <ScrollView 
              showsVerticalScrollIndicator = {true} 
              keyboardShouldPersistTaps = {'always'}
              style={{

              }}>
              <View style=
              {{
                width: 5,
                height: 1000,
              }}>

              </View>
              <ScrollView 
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
                    width: 1000,
                    height: 5,
                    //position: 'absolute',
                  }}>
                  </View>
                  <Text style={{fontSize:16}}></Text>
                
                  {this.state.noteList.map((note) => {
                    //console.log(JSON.stringify(note))
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
                          key = {note._id}
                          id = {note._id}
                          x = {note.x} 
                          y = {note.y} 
                          color = {note.color} 
                          text = {note.text}
                          tags = {note.tags}/>
                      //</DoubleClick>
                    )
                  })}
                </View>
              </ScrollView>
            </ScrollView>
          </View>
          
        </View>
      
    );
  }
}

/*
 <View style={{flex: 9, backgroundColor: 'white'}}>
 </View>
<Text style={{fontSize:96}}>Scroll me plz</Text>
*/

export default BoardScreen;

//<Note x = {0} y = {0} color = '#ffff99'/>