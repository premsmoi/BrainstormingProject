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
  
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.boardName,
  });

  constructor(props) {
    super(props);
    this.newId = 2;
    this.tempNote = null;
    this.state = {
      boardName: '',
      //noteList : [ {id: 1, x: 0, y: 0, color: 'blue', text: 'My name is Smoi'},
      //             {id: 2, x: 100, y: 100, color: 'pink', text: 'Passakorn'} ],
      noteList: [],
      tagList: [],
      visibleNewNoteModal: false,
      visibleEditNoteModal: false,
      newColor: 'red',
      newNoteText: '',
    }
    this.isVisibleOpenNoteModal = false;
    this.deleteNote = this.deleteNote.bind(this);
    this.focusNote = this.focusNote.bind(this);
    this.updateNoteList = this.updateNoteList.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.setVisibleOpenNoteModal = this.setVisibleOpenNoteModal.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

      if(obj.body.code == 'updatedNotes'){
        console.log('isVisibleOpenNoteModal: '+this.isVisibleOpenNoteModal)
        if(this.isVisibleOpenNoteModal==false){
          this.setState({noteList: []})
          this.setState({noteList: obj.body.notes})
          console.log('updated notes')
        }
      }

      if(obj.body.code == 'getTags'){
        this.setState({tagList: obj.body.tags})
      }
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    this.ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
      console.log('Closed!')
    };

    this.ws.onopen = () => {
      // connection opened
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
    };
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
    var newNote = {
      from: 'Board',
      boardId: this.props.navigation.state.params.boardId,
      writer: this.props.navigation.state.params.user.username, 
      x: 100, 
      y: 200, 
      color: this.state.newColor, 
      text: this.state.newNoteText,
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
      <View>
        <TouchableWithoutFeedback
            onPress = {() => {Alert.alert('Add tag')}}
          >
            <View style = {styles.button}>
              <Text 
                style={{
                  fontSize: 16, 
                  color: '#1ac6ff',  
                  marginVertical: 4, 
                  marginHorizontal: 8, 
                }}>
                  Add tag
              </Text> 
            </View>
          </TouchableWithoutFeedback>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("OK", () => {
            this.setState({ visibleNewNoteModal: false })
            this.createNewNote()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => this.setState({ visibleNewNoteModal: false }))}
        </View>
        <View style = {{flex: 1}}/>
      </View>
    </View>
  )

  render() {
    console.log('render')
    return (
      
        <View style={{flex: 1}}>
          <Modal isVisible={this.state.visibleNewNoteModal}>
            {this._renderNewNoteModal()}
          </Modal>
          <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white',}}>
            <View style={{ 
              marginVertical: 10, 
              marginHorizontal: 20,
              flex: 1 
            }}>
              {this._renderButton('Add note', ()=> this.setState({visibleNewNoteModal: true}))}
            </View>
            <View style={{
              flex: 1,
              marginVertical: 10, 
              marginHorizontal: 20,
            }}>
              {this._renderButton('Manage', ()=> {
                this.props.navigation.navigate(
                  'BoardManager', 
                  { user: this.props.navigation.state.params.user, 
                    boardId: this.props.navigation.state.params.boardId, 
                    boardName: this.props.navigation.state.params.boardName 
                  }
                )
                this.ws.close()
              })}
            </View>
            <View style={{ 
              marginVertical: 10, 
              marginHorizontal: 20,
              flex: 1 
            }}>
              {this._renderButton('Exit', () => {
                this.props.navigation.navigate('Home', { user: this.props.navigation.state.params.user })
                this.ws.close()
                }
              )}
            </View>  
          </View>
          
          
          <View style={{flex: 9}}>
            <ScrollView 
              showsVerticalScrollIndicator = {true} 
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
                          setVisibleOpenNoteModal = {this.setVisibleOpenNoteModal}
                          key = {note._id}
                          id = {note._id}
                          x = {note.x} 
                          y = {note.y} 
                          color = {note.color} 
                          text = {note.text}/>
                      
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