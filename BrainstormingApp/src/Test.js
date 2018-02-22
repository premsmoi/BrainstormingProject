import React, { Component } from 'react';
import { 
  Alert, 
  AppRegistry, 
  Button, 
  StyleSheet, 
  View, 
  TextInput, 
  Text,
  TouchableOpacity, 
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import HomeScreen from './HomeScreen';
import RestAPI from './RestAPI';
import Modal from "react-native-modal";
import styles from "./app.style";

//window.navigator.userAgent = 'react-native';
import io from 'socket.io-client';



class Test extends Component {
   static navigationOptions = {
    //title: 'Login',
   }
  constructor(props) {
    super(props);
    this.state = { 
      msg: '',
      socket: {},
    };

    
    //Alert.alert('Test')
    this.socket = io('http://10.0.2.2:3000',
      {
        jsonp: false,
        reconnection: false,
        //autoConnect: false,
      }
      );

    this.socket.on('connect', () => {
      Alert.alert('Connect')
    })

    this.socket.on('disconnect', () => {

      Alert.alert('Disconnect')
    })


  }

  
  connect(){
    //this.socket.open();
    
  }

  disconnect(){
    this.socket.disconnect();
  }

  sendMsg(){
    this.socket.emit('hello', this.state.msg, (data) => {
      Alert.alert(data); // data will be 'woot'
    });
  }



 

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderTextInput = (placeholder, onChange) => (
    <View>
      <TextInput
          style={{
            height: 40, 
            //borderColor: 'gray', 
            //borderWidth: 1
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
      />
    </View>
  );



  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 2}}/>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            <View>
              <TextInput
                  style={{
                    height: 40, 
                  }}
                  placeholderTextColor = 'gray'
                  placeholder = 'Message'
                  onChangeText=  {(msg) => this.setState({msg})}
                   ref={element => {
                    this.loginUsernameInput = element
                  }}
              />
            </View>
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            <View>
            </View>
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            {this._renderButton('Connect', () => {
              this.connect()
              //this.setState({ loginUsername: '', loginPassword: ''})
            })}
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
            <View style={{flex: 2}}>
              {this._renderButton('Disconnect', () => this.disconnect())}
            </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
            <View style={{flex: 2}}>
              {this._renderButton('Send', () => this.sendMsg())}
            </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:2}}/>
      </View>
    );
  }
}

//onPress={() => this.testLogin()}
//onPress={() => this.login(this.state.loginUsername, this.state.loginPassword)}


export default Test;
// skip this line if using Create React Native App
//AppRegistry.registerComponent('BrainstormingApp', () => LoginScreen);

