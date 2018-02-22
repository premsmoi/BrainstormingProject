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
  TouchableOpacity
} from 'react-native';
import styles from "./app.style";
import {noteColor, borderColor} from './colors'
import Modal from "react-native-modal";
import { StackNavigator, NavigationActions } from 'react-navigation';
import Note from './Note';
//import DoubleClick from 'react-native-double-click';

import io from 'socket.io-client';
 
const ip = '10.0.2.2:8080'
//const ip = '192.168.43.143:8080'
const socket = io('http://localhost');
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
      visibleNewNoteModal: false,
      visibleEditNoteModal: false,
      newColor: 'red',
    }
    this.deleteNote = this.deleteNote.bind(this);
    this.focusNote = this.focusNote.bind(this);
    this.updateNotePosition = this.updateNotePosition.bind(this);
    this.updateNoteText = this.updateNoteText.bind(this);
    this.updateNoteList = this.updateNoteList.bind(this);

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
        this.setState({noteList: []})
        this.setState({noteList: obj.body.notes})
        console.log('updated notes')
        //this.props.navigation.navigate('Board',{user: this.props.navigation.state.params.user, boardName : this.props.navigation.state.params.boardName, boardId : this.props.navigation.state.params.boardId})
        //console.log(JSON.stringify(this.state.noteList))
      }
      /*console.log('###############')
      for(i=0;i<obj.body.notes.length;i++){
        console.log(obj.body.notes[i]._id)
      }
      console.log('###############')*/
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
        code: 'tagBoard',
        username: this.props.navigation.state.params.user.username,
        boardId: this.props.navigation.state.params.boardId
      }
      var requestString = JSON.stringify(tagClientRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)
      console.log('req: '+requestString)
    };
  }

  getNotes(){
    var getNotesRequest = {
      code: 'getNotes',
      boardId: this.props.navigation.state.params.boardId,
    }
    var requestString = JSON.stringify(getNotesRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  updateNotePosition(id, x, y){
    var newNoteRequest = {
      code: 'updateNotePosition',
      noteId: id,
      newX: x,
      newY: y,
      updated: new Date().getTime(),
    }
    var requestString = JSON.stringify(newNoteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  updateNoteText(id, text){
    var newNoteRequest = {
      code: 'updateNoteText',
      noteId: id,
      newText: text,
      updated: new Date().getTime(),
    }
    var requestString = JSON.stringify(newNoteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  updateNoteList(){
    var newNoteRequest = {
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
      boardId: this.props.navigation.state.params.boardId,
      writer: this.props.navigation.state.params.user.username, 
      x: 100, 
      y: 200, 
      color: this.state.newColor, 
      text: '',
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
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 4,
    }}>
      <View style={{flexDirection: 'row', padding: 6, margin: 8,}}>
        {this._renderColorPicker('red')}
        {this._renderColorPicker('pink')}
        {this._renderColorPicker('green')}
        {this._renderColorPicker('blue')}
        {this._renderColorPicker('yellow')}
      </View>
      <View/>
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
            <View style={{flex: 1}}></View>
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
                    console.log(JSON.stringify(note))
                    return(
                      //<DoubleClick onClick={this.handleClick}>
                        <Note 
                          deleteNote = {this.deleteNote} 
                          focusNote = {this.focusNote}
                          updateNotePosition = {this.updateNotePosition}
                          updateNoteText = {this.updateNoteText}
                          updateNoteList = {this.updateNoteList}
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