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
import Note from './Note'

class TopicScreen extends Component {
   static navigationOptions = {
    //title: 'Login',
   }
  constructor(props) {
    super(props);
    this.state = {
      noteList : [ {id: 1, x: 0, y: 0, color: '#ffff99'}, 
                   {id: 2, x: 100, y: 100, color: '#ff99c2'} ],
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.topicName,
    headerRight: 
      <View style={{ marginVertical: 20, 
        marginHorizontal: 20,
        //width: 125, 
        //height: 50,
        //flex: 4 
      }}>
        <Button
          onPress={() => Alert.alert('Create Idea!')}
          //onPress={() => NavigationActions.back()}
          title="Create Idea"
        />
      </View>
  });



  render() {
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          
          {this.state.noteList.map((note) => {
            return(
              <Note key = {note.id} x = {note.x} y = {note.y} color = {note.color}/>
            )
          })}
        </View>
    
    );
  }
}

export default TopicScreen;

//<Note x = {0} y = {0} color = '#ffff99'/>