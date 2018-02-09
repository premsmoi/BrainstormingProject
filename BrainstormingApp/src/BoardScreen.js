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
  ScrollView 
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';
import Draggable from 'react-native-draggable';
import Note from './Note';
//import DoubleClick from 'react-native-double-click';

class BoardScreen extends Component {
   static navigationOptions = {
    //title: 'Login',
   }
  constructor(props) {
    super(props);
    this.state = {
      noteList : [ {id: 1, x: 0, y: 0, color: 'blue', text: 'My name is Smoi'}, 
                   {id: 2, x: 100, y: 100, color: 'pink', text: 'Passakorn'} ],
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    Alert.alert('This is awesome \n Double tap succeed');
  }



  createNewNote = () => {
    console.log(this.state.noteList)
    var newNote = {id:3, x: 100, y: 200, color: 'green', text: 'Senior Project'}
    //this.state.noteList.push(newNote)
    //console.log(this.state.noteList)
    this.setState(previousState => {
      //console.log(previousState.noteList)
      var newNoteList = previousState.noteList
      newNoteList.push(newNote)
      //console.log('newNoteList'+newNoteList)
      return {noteList: newNoteList}
    });
    
    //console.log(this.state.noteList)
    Alert.alert('Create Idea!');
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.topicName,
    //headerRight: 
      
  });



  render() {
    return (
      
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{ marginVertical: 20, 
            marginHorizontal: 20,
            //width: 125, 
            //height: 50,
            //flex: 4 
            }}>
              <Button
                onPress={this.createNewNote}
                //onPress={this.createNewNote}
                title="Create Idea"
              />
            </View>
          </View>
          
          
          <View style={{flex: 9}}>
            <ScrollView 
              horizontal = {true}
              showsHorizontalScrollIndicator = {true} 
              style = {{
                backgroundColor: 'white',
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
                    
                      <Note key = {note.id} x = {note.x} y = {note.y} color = {note.color} text = {note.text}/>
                    
                    //</DoubleClick>
                  )
                })}
              </View>
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