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
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import {
  StackNavigator,
  NavigationActions
} from 'react-navigation';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view'
import Modal from "react-native-modal";
import {
  navBarColor,
} from './../colors'
import {renderButton, renderIconButton} from './../RenderUtilities';
import styles from "./../app.style";
import {
  ip
} from './../Configuration';
import {
  setAppUser
} from '../App';
import App from '../App'

class UserProfileScreen extends Component {
  static navigationOptions = {
    //title: 'Login',
  }
  constructor(props) {
    super(props);
    this.state = {
      newName: App.getAppUser().name,
      newPassword: '',
      newEmail: App.getAppUser().email,
      newFaculty: App.getAppUser().faculty,
      newMajor: App.getAppUser().major,

    };
    this.ws = App.getAppWebSocket()

    this.ws.onmessage = (e) => {
      // a message was received
      //console.log("e.data: "+e.data);
      var obj = JSON.parse(e.data)
      //console.log(obj.body.notes)
      if (obj.body.code == 'getUser') {
        console.log('I got user')
        App.setAppUser(obj.body.user)
      }
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('Home')
    });
  };

  updateUser = () => {
    var updateUserRequest = {
      code: 'updateUser',
      updatedObj: {
        username: App.getAppUser().username,
        name: this.state.newName,
        faculty: this.state.newFaculty,
        major: this.state.newMajor,
        email: this.state.newEmail,
      }
    }
    var requestString = JSON.stringify(updateUserRequest)
    this.ws.send(requestString)
  };

  _renderTextBeforeTextInput = (text) => (
    <View>
      <Text style = {{
        fontSize: 16,
        color: 'grey',
        marginVertical: 5,
        marginRight: 5
      }}>
      {text}
      </Text>
    </View>
    );

  _renderTextInput = (placeholder, onChange, value) => (
    <View>
      <TextInput
          style={{
            height: 36, 
            width: 200,
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
          underlineColorAndroid = {'black'}
          value = {value}
      />
    </View>
  );

  _renderPasswordInput = (placeholder, onChange) => (
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
          secureTextEntry = {true}
      />
    </View>
  );

  _renderNavBar = () => (
    <View style={{
            flexDirection: 'row',
            backgroundColor: navBarColor,
          }}>
          

            <View style={{
              flex: 1,
            }}/>
            <View style={{
              justifyContent: 'center',
              alignItems: 'flex-end', 
              flex: 1,
              marginVertical: 5, 
              marginHorizontal: 20,
            }}>
            <TouchableWithoutFeedback
              onPressIn={() => {
                  this.props.navigation.navigate('Home')
                }}
            >
              <View>
                <Text style = {{fontSize: 20, color: 'black', marginVertical: 5, marginHorizontal: 10, alignItems: 'center'}}>
                  Back
                </Text>
              </View>
            </TouchableWithoutFeedback>
            </View>
      </View>
    )

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
      <KeyboardAwareScrollView  keyboardShouldPersistTaps = {'always'} >
        {this._renderNavBar()}
        <View style = {{
            
          }}>
            <Text style={{
              fontSize: 30, 
              color: 'grey',  
              marginVertical: 5, 
              marginHorizontal: 10 
            }}>My Profile</Text>
          </View>
          <View style = {{
            marginHorizontal: 20 
          }}>
            <View style = {{
              flexDirection: 'row'
            }}>
              {this._renderTextBeforeTextInput('Username:  '+App.getAppUser().username)}
            </View>
            <View style = {{
              flexDirection: 'row'
            }}>
              {this._renderTextBeforeTextInput('Name: ')}
              {this._renderTextInput('Input Name', (newName) => this.setState({newName}), this.state.newName)}
            </View>
            <View style = {{
              flexDirection: 'row'
            }}>
              {this._renderTextBeforeTextInput('Faculty: ')}
              {this._renderTextInput('Input Faculty', (newFaculty) => this.setState({newFaculty}), this.state.newFaculty)}
            </View>
            <View style = {{
              flexDirection: 'row'
            }}>
              {this._renderTextBeforeTextInput('Major: ')}
              {this._renderTextInput('Input Major', (newMajor) => this.setState({newMajor}), this.state.newMajor)}
            </View>
            <View style = {{
              flexDirection: 'row'
            }}>
              {this._renderTextBeforeTextInput('Email: ')}
              {this._renderTextInput('Input Email', (newEmail) => this.setState({newEmail}), this.state.newEmail)}
            </View>
          </View>
          {renderButton('Save', () => this.updateUser())}
      </KeyboardAwareScrollView>
      </View>
    );
  }
}

//onPress={() => this.testLogin()}
//onPress={() => this.login(this.state.loginUsername, this.state.loginPassword)}


export default UserProfileScreen;
// skip this line if using Create React Native App
//AppRegistry.registerComponent('BrainstormingApp', () => LoginScreen);

