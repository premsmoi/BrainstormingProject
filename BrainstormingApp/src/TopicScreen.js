import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text, TouchableWithoutFeedback } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import Draggable from 'react-native-draggable';

class TopicScreen extends Component {
   static navigationOptions = {
    //title: 'Login',
   }
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.topicName,
  });

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
        	<View style={{ marginVertical: 20, 
            marginHorizontal: 20,
            //width: 125, 
            height: 50,
            flex: 4 
          }}>
        		<Button
          			onPress={() => Alert.alert('Create Idea!')}
          			//onPress={() => NavigationActions.back()}
          			title="Create Idea"
        		/>
      		</View>

          <View style={{ flex: 6 }}>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Draggable renderSize={56} renderColor='black' offsetX={-100} offsetY={-200} renderText='A' pressDrag={()=>alert('touched!!')}/> 
          <Draggable reverse={false} renderColor='red' renderShape='square' offsetX={0} offsetY={0} renderText='B'/>
          <Draggable/>
        </View>
      </View>
    );
  }
}

export default TopicScreen;