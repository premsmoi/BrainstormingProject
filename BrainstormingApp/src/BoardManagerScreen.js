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
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import GroupScreen from './GroupScreen';
import styles from "./app.style";
import Modal from "react-native-modal";
import {ip} from './Configuration';


//const ip = '10.0.2.2:8080'
//const ip = '192.168.43.143:8080'

class BoardManagerScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Board Manager'
  });
   
  constructor(props) {
    super(props);
    this.state = {

    }

    this.ws = new WebSocket('ws://'+ip, 'echo-protocol');

    this.ws.onmessage = (e) => {
      // a message was received
      //console.log("e.data: "+e.data);
      var obj = JSON.parse(e.data)
      //console.log(obj.body.notes)
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
      var tagClientRequest = {
        from: 'BoardManager',
        code: 'tagBoardManager',
        username: this.props.navigation.state.params.user.username,
        boardId: this.props.navigation.state.params.boardId
      }
      var requestString = JSON.stringify(tagClientRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)
     
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
   this.ws.close()
      this.props.navigation.navigate('Board',
        { 
          user: this.props.navigation.state.params.user, 
          boardId: this.props.navigation.state.params.boardId, 
          boardName: this.props.navigation.state.params.boardName 
        }
      )
    return true;
  }

  

   _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

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


   

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        
        <View style={{flex: 1, flexDirection: 'row'}}>
        	<View style={{ marginVertical: 20, 
            marginHorizontal: 20,
            //width: 125, 
            height: 50,
            flex: 2.5
          }}>
      		</View>

          <View style={{ flex: 1 }}>
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginHorizontal: 10, 
            //width: 40, 
            height: 50,
            flex: 1.5
          }}>
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginLeft: 10,
            marginRight: 20, 
            //width: 60, 
            height: 50,
            flex: 1.5
          }}>
            {this._renderButton("Back", () => {
              this.props.navigation.navigate(
                  'Board', 
                  { user: this.props.navigation.state.params.user, 
                    boardId: this.props.navigation.state.params.boardId, 
                    boardName: this.props.navigation.state.params.boardName 
                  }
              )
              this.ws.close()
            })}
          </View>
        </View>
        <View style = {{flex: 1 }}>
          <Text style={{fontSize: 30, 
            color: 'grey',  
            marginVertical: 20, 
            marginHorizontal: 20 
          }}>Manager</Text>
        </View>
        <View style = {{flex: 5 }}>
        </View>
      </View>
    );
  }
}

/*const RootNavigator = StackNavigator({
    Group: {
      screen: GroupScreen,
      navigationOptions: {
        headerTitle: 'My Group',
      }
    }
  },
  {headerMode: 'none'});*/


export default BoardManagerScreen;