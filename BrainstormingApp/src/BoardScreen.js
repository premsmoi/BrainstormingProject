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
      noteList : [ {id: 1, x: 0, y: 0, color: 'blue', text: 'My name is Smoi'},
                   {id: 2, x: 100, y: 100, color: 'pink', text: 'Passakorn'} ],
      visibleSelectColorModal: false,
      newColor: 'red',
    }
    this.handleClick = this.handleClick.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.focusNote = this.focusNote.bind(this);
    console.log(this.props)

    this.ws = new WebSocket('ws://10.0.2.2:8080', 'echo-protocol');

    this.ws.onopen = () => {
      // connection opened
      //ws.send('Hello Node Server!'); // send a message
    };

    this.ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
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
  }

  
  handleClick() {
    Alert.alert('This is awesome \n Double tap succeed');
  }

  deleteNote = (deletedId) => {
    var tempList = this.state.noteList
    var deletedIndex = this.state.noteList.findIndex(function(id) {return id == deletedId})
    tempList.splice(deletedIndex, 1)
    this.setState({noteList: tempList})
  }

  focusNote = (focusId) => {
    //console.log('focusId: '+focusId)
    var tempList = this.state.noteList
    var deletedNote = this.state.noteList.find(function(note) {return note.id == focusId})
    var deletedIndex = this.state.noteList.findIndex(function(note) {return note.id == focusId})
    //console.log('deletedIndex: '+deletedIndex)
    tempList.splice(deletedIndex, 1)
    tempList.push(deletedNote)
    this.setState({noteList: tempList})
  }

  createNewNote = () => {
    var newNote = {id:++this.newId, x: 100, y: 200, color: this.state.newColor, text: ''}
    this.setState(previousState => {
      //console.log(previousState.noteList)
      var newNoteList = previousState.noteList
      newNoteList.push(newNote)
      //console.log('newNoteList'+newNoteList)
      return {noteList: newNoteList}
    });
    console.log(this.state.noteList)
    //console.log(this.state.noteList)
    //Alert.alert('Create Idea!');
    var noteObj = JSON.stringify(newNote)
    this.ws.send(noteObj)
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
  );

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
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
            this.setState({ visibleSelectColorModal: false })
            this.createNewNote()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => this.setState({ visibleSelectColorModal: false }))}
        </View>
        <View style = {{flex: 1}}/>
      </View>
    </View>
  );

  render() {
    return (
      
        <View style={{flex: 1}}>
          <Modal isVisible={this.state.visibleSelectColorModal}>
            {this._renderModalContent()}
          </Modal>
          <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'white',}}>
            <View style={{ 
              marginVertical: 10, 
              marginHorizontal: 20,
              flex: 1 
            }}>
              {this._renderButton('Add note', ()=> this.setState({visibleSelectColorModal: true}))}
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
                    return(
                      //<DoubleClick onClick={this.handleClick}>
                      
                        <Note 
                          deleteNote = {this.deleteNote} 
                          focusNote = {this.focusNote}
                          key = {note.id} 
                          id = {note.id}
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