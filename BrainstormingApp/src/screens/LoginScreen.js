import React, {
  Component
} from 'react';
import createReactClass from 'create-react-class'
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
} from 'react-native';
import {
  StackNavigator,
  NavigationActions
} from 'react-navigation';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view'
import Modal from "react-native-modal";
import styles from "./../app.style";
import {
  ip,
  scale
} from './../Configuration';
import {
  setAppUser
} from '../App';
import App from '../App'

import {renderButton, renderIconButton} from './../RenderUtilities';
import { LoginButton, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
      
var Login = createReactClass({
  render: function() {
    return (
      <View>
        
      </View>
    );
  }
});

class LoginScreen extends Component {
  static navigationOptions = {
    //title: 'Login',
  }
  constructor(props) {
    super(props);
    this.state = {
      loginUsername: '',
      loginPassword: '',
      regUsername: '',
      regPassword: '',
      regPassword2: '',
      regName: '',
      regEmail: '',
      visibleRegModal: false,

    };

    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp()
    });
    AccessToken.getCurrentAccessToken().
    then( (data) => {
      if(data)
        this.fbLogin({id: data.userID, name: '1', email: '1'})
    }).catch( (err) => {
      throw err
    })
    console.log(Dimensions.get('window'))

  }

  register() {
    var params = {
      username: this.state.regUsername,
      password: this.state.regPassword,
      password2: this.state.regPassword2,
      name: this.state.regName,
      email: this.state.regEmail,
    };

    console.log('Register for ' + JSON.stringify(params))

    fetch('http://' + ip + '/register', {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
      })
      .then((response) => {
        var body = JSON.parse(response._bodyText);
        console.log(body)
        console.log(body['status'])
        if (body['status'] == 0) {
          var errMsg = ''
          for (i = 0; i < body['errors'].length; i++) {
            errMsg = errMsg + body['errors'][i] + '\n';
          }
          Alert.alert(
            'Alert',
            errMsg, [{
              text: 'OK',
              onPress: () => console.log('OK Pressed')
            }, ], {
              cancelable: false
            }
          )
        } else {
          this.setState({
            visibleRegModal: false
          })
          Alert.alert(
            'Alert',
            'Register complete', [{
              text: 'OK',
              onPress: () => console.log('OK Pressed')
            }, ], {
              cancelable: false
            }
          )
        }
        return response.json()
      })
      .catch((error) => {
        throw error;
      });
  }


  login() {
    var params = {};
    params['username'] = this.state.loginUsername;
    params['password'] = this.state.loginPassword;

    //fetch('http://10.0.2.2:8080/login', {
    fetch('http://' + ip + '/login', {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
      })
      //.then((response) => response.json())
      .then((response) => {
        //console.log(response);
        var body = JSON.parse(response._bodyText);
        //console.log(body);
        if (body.loginSuccess == true) {
          console.log(body.user.username + ' -> Login')
          App.setAppUser(body.user)
          App.startAppWebSocket()
          App.getAppWebSocket().onopen = () => {
            console.log('ws is opened')
            this.props.navigation.navigate('Home');
          }

        } else
          Alert.alert(body['message']);
        return response.json()
      })
      .catch((error) => {
        throw error;
      });
    this.loginUsernameInput.setNativeProps({
      text: ''
    })
    this.loginPasswordInput.setNativeProps({
      text: ''
    })
  }

  fbLogin(obj){
    console.log(JSON.stringify(obj))
    fetch('http://' + ip + '/fb_login', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
      })
      //.then((response) => response.json())
      .then((response) => {
        //console.log(response);
        var user = JSON.parse(response._bodyText);
        console.log('body: '+JSON.stringify(user))
        //console.log(body.user.username + ' -> Login')
          App.setAppUser(user)
          App.startAppWebSocket()
          App.getAppWebSocket().onopen = () => {
            console.log('ws is opened')
            this.props.navigation.navigate('Home');
          }
      })
      .catch((error) => {
        throw error;
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
          underlineColorAndroid = {'black'}
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

  _renderRegModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      {this._renderTextInput('Username', (regUsername) => this.setState({regUsername}))}
      {this._renderPasswordInput('Password', (regPassword) => this.setState({regPassword}))}
      {this._renderPasswordInput('Confirm Password', (regPassword2) => this.setState({regPassword2}))}
      {this._renderTextInput('Name', (regName) => this.setState({regName}))}
      {this._renderTextInput('Email', (regEmail) => this.setState({regEmail}))}
   
      <View style={{flexDirection: 'row'}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Register", () => {
            this.register()
            console.log('Reg!!')
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => {
            this.setState({ visibleRegModal: false })
            this.setState({regUsername: '', regPassword: '', regPassword2: '', regName: '', regEmail: '',})
            }
          )}

        </View>
        <View style = {{flex: 1}}/>
      </View>
    </View>
  );

  _renderFbLoginButton = () => (
    <LoginButton
          readPermissions = {["public_profile", "email"]}
          //publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    let accessToken = data.accessToken;
                    //alert(accessToken.toString());

                    const responseInfoCallback = (error, result) => {
                      if (error) {
                        console.log(error)
                        //alert('Error fetching data: ' + error.toString());
                      } else {
                        console.log(result)
                        this.fbLogin(result)
                        //alert('Success fetching data: ' + result.toString());
                      }
                    }

                    const infoRequest = new GraphRequest(
                      '/me',
                      {
                        accessToken: accessToken,
                        parameters: {
                          fields: {
                            string: 'email,name,first_name,middle_name,last_name'
                          }
                        }
                      },
                      responseInfoCallback
                    );

                    // Start the graph request.
                    new GraphRequestManager().addRequest(infoRequest).start();

                  })
              }
            }
          }
          //onLogoutFinished={() => alert("logout.")}
          />
    )


  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
      <KeyboardAwareScrollView  keyboardShouldPersistTaps = {'always'} >
        <Modal isVisible={this.state.visibleRegModal}>
            {this._renderRegModal()}
        </Modal>
        <View style={{height: 200}}/>
        <View style={{flex: 1, flexDirection: 'row', paddingVertical: 5}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            <View>
              <TextInput
                  style={{
                    height: 40, fontSize: 16,
                  }}
                  placeholderTextColor = 'gray'
                  placeholder = 'Username'
                  underlineColorAndroid = {'black'}
                  onChangeText=  {(loginUsername) => this.setState({loginUsername})}
                   ref={element => {
                    this.loginUsernameInput = element
                  }}
              />
            </View>
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex: 1, flexDirection: 'row', paddingVertical: 5}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            <View>
              <TextInput
                  style={{
                    height: 40, fontSize: 16,
                  }}
                  placeholderTextColor = 'gray'
                  placeholder = 'Password'
                  secureTextEntry = {true}
                  underlineColorAndroid = {'black'}
                  onChangeText=  {(loginPassword) => this.setState({loginPassword})}
                   ref={element => {
                    this.loginPasswordInput = element
                  }}
              />
            </View>
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row', paddingVertical: 5}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            {renderButton('Login', () => {
              this.login()
            })}
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row', paddingVertical: 5}}>
          <View style={{flex: 1}}/>
            <View style={{flex: 2}}>
              {renderButton('Register', () => this.setState({visibleRegModal: true}))}
            </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'center'}}>
          {this._renderFbLoginButton()}
        </View>
      </KeyboardAwareScrollView>
      </View>
    );
  }
}

//onPress={() => this.testLogin()}
//onPress={() => this.login(this.state.loginUsername, this.state.loginPassword)}


export default LoginScreen;
// skip this line if using Create React Native App
//AppRegistry.registerComponent('BrainstormingApp', () => LoginScreen);

