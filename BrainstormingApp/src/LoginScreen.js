import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import HomeScreen from './HomeScreen';
import RestAPI from './RestAPI';

var api = new RestAPI(); 

class LoginScreen extends Component {
   static navigationOptions = {
    //title: 'Login',
   }
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
  }
  _onPressButton(username, password) {
    //Alert.alert(username + " " + password)
    //console.log('Register!');
    
    /*  return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        //return responseJson.movies;
       Alert.alert(JSON.stringify(responseJson));
      })
      .catch((error) => {
        Alert.alert(JSON.stringify(error));
      });
    */
  }

  login(username, password){
    
    /*console.log(params);
    var success = fetch('http://10.0.2.2:8080/login?username='+username+'&password='+password)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        return false;
      });
    if(success)
      this.props.navigation.navigate('Home',{name : 'Smoi'});
    else
      Alert.alert("Login Failed!");
    */
    var params = {};
    params['username'] = username;
    params['password'] = password;
    
        fetch('http://10.0.2.2:8080/login', {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })
        //.then((response) => response.json())
        .then((response) => {
          var obj = JSON.parse(response._bodyText);
          console.log(obj.loginStatus);
          if(obj.loginStatus == 1)
            this.props.navigation.navigate('Home',{name : 'Smoi'});
          else
            Alert.alert('Login failed!');
        });
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

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholderTextColor = 'gray'
          placeholder = 'username'
          onChangeText={(username) => this.setState({username})}
          //onChangeText={(text) => this.setState({text})}
          //value={this.state.text1}
        />
         <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholderTextColor = 'gray'
          placeholder = 'password'
          onChangeText={(password) => this.setState({password})}
          secureTextEntry = {true}
          //onChangeText={(text) => this.setState({text})}
          //value={this.state.text2}
        />
        <View style={styles.buttonContainer}>
          <Button
            //onPress={() => this.login(this.state.username, this.state.password)}
            onPress={() => this.props.navigation.navigate('Home',{name : 'Smoi'})}
            title="Login"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => Alert.alert('Register!')}
            title="Register"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})


export default LoginScreen;
// skip this line if using Create React Native App
//AppRegistry.registerComponent('BrainstormingApp', () => LoginScreen);

