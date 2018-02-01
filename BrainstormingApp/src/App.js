import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import HomeScreen from './HomeScreen';
import GroupScreen from './GroupScreen';
import TopicScreen from './TopicScreen';
/*const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Home Screen</Text>
    <Button
      //onPress={() => navigation.navigate('Login')}
      onPress={() => NavigationActions.back()}
      title="Go to login"
    />
  </View>
);*/


class LoginScreen extends Component {
   static navigationOptions = {
    //title: 'Login',
   }
  constructor(props) {
    super(props);
    this.state = { text1: 'username', text2: 'password' };
  }
  _onPressButton() {
    Alert.alert('Register!')
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholderTextColor = 'gray'
          placeholder = 'username'
          //onChangeText={(text) => this.setState({text})}
          //value={this.state.text1}
        />
         <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          placeholderTextColor = 'gray'
          placeholder = 'password'
          //onChangeText={(text) => this.setState({text})}
          //value={this.state.text2}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.props.navigation.navigate('Home',{name : 'Smoi'})}
            title="Login"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressButton}
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

const myNavigator = StackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerTitle: 'Login',
    },
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Home',
    },
  },
  Group: {
    screen: GroupScreen,
  },
  Topic: {
    screen: TopicScreen,
  }
});

// skip this line if using Create React Native App
AppRegistry.registerComponent('BrainstormingApp', () => LoginScreen);

export default myNavigator;