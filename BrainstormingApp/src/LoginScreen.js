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

var api = new RestAPI();

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
  }

  register(){
    var params = {
      username: this.state.regUsername,
      password: this.state.regPassword,
      password2: this.state.regPassword2,
      name: this.state.regName,
      email: this.state.regEmail,
    };
    /*var params = {
      username: 'premsmoi',
      password: 'prem393390',
      password2: 'prem393390',
      name: 'Passakorn',
      email: 'premsmoi@gmail.com',
    };*/

    console.log('Register for '+JSON.stringify(params))

    fetch('http://10.0.2.2:8080/register', {
    //fetch('http://192.168.43.143:8080/register', {
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
          if(body['status']==0){
            var errMsg = ''
            for(i=0;i<body['errors'].length;i++){
              errMsg = errMsg + body['errors'][i] + '\n';
            }
            Alert.alert(
              'Alert',
              errMsg,
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
          }
          else{
            this.setState({visibleRegModal: false})
            Alert.alert(
              'Alert',
              'Register complete',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
          }
          return response.json()
        })
        .catch((error) => {
          throw error;
        });
  }
  
  
  login(){
    var params = {};
    params['username'] = this.state.loginUsername;
    params['password'] = this.state.loginPassword;
    
        fetch('http://10.0.2.2:8080/login', {
        //fetch('http://192.168.43.143:8080/login', {
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
          if(body.loginSuccess == true){
            console.log(body.user.username + ' -> Login')
            this.props.navigation.navigate('Home',{user : body.user});
          }
          else
            Alert.alert(body['message']);
          return response.json()
        })
        .catch((error) => {
          throw error;
        });
    this.loginUsernameInput.setNativeProps({ text: '' })
    this.loginPasswordInput.setNativeProps({ text: '' })
    //console.log(success);
    /*var result = api.login(username, password)
    .then(response => response.token)
    .then(token => saveToken(token))
    .catch(err => console.log(err.message));
    console.log(result);
    if(result.loginStatus=='1'){
      this.props.navigation.navigate('Home',{name : 'Smoi'});
    }
    else{
      Alert.alert('Login failed!');
    }*/
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

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Modal isVisible={this.state.visibleRegModal}>
            {this._renderRegModal()}
        </Modal>
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
                  placeholder = 'Username'
                  onChangeText=  {(loginUsername) => this.setState({loginUsername})}
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
              <TextInput
                  style={{
                    height: 40, 
                  }}
                  placeholderTextColor = 'gray'
                  placeholder = 'Password'
                  secureTextEntry = {true}
                  onChangeText=  {(loginPassword) => this.setState({loginPassword})}
                   ref={element => {
                    this.loginPasswordInput = element
                  }}
              />
            </View>
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
          <View style={{flex: 2}}>
            {this._renderButton('Login', () => {
              this.login()
              //this.setState({ loginUsername: '', loginPassword: ''})
            })}
          </View>
          <View style={{flex: 1}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row'}}>
          <View style={{flex: 1}}/>
            <View style={{flex: 2}}>
              {this._renderButton('Register', () => this.setState({visibleRegModal: true}))}
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


export default LoginScreen;
// skip this line if using Create React Native App
//AppRegistry.registerComponent('BrainstormingApp', () => LoginScreen);

