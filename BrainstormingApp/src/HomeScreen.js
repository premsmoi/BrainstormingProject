import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import GroupScreen from './GroupScreen';
import styles from "./app.style";
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

//const RootNavigator = StackNavigator({});

class HomeScreen extends Component {


  /*toGroupScreen(){
    RootNavigator = StackNavigator({
    Group: {
      screen: GroupScreen,
      navigationOptions: {
        headerTitle: 'My Group',
      }
    }
  });

  this.props.navigation.navigate('Group',{name : 'Smoi'})

  }*/
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.username,
  });
   
  constructor(props) {
    super(props);
  }

  logout() {
    console.log('Logout');
    fetch('http://10.0.2.2:8080/logout')
    .then((response) => {
      this.props.navigation.navigate('Login')
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

   _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

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
            {this._renderButton("Create Board", () => Alert.alert('Create Board!'))}
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
            {this._renderButton("Info", () => Alert.alert('My Info!'))}
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginLeft: 10,
            marginRight: 20, 
            //width: 60, 
            height: 50,
            flex: 1.5
          }}>
            {this._renderButton("Logout", () => this.logout())}
          </View>
        </View>
        <View style = {{flex: 1 }}>
          <Text style={{fontSize: 30, 
            color: 'grey',  
            marginVertical: 20, 
            marginHorizontal: 20 
          }}>My Boards</Text>
        </View>
        <View style = {{flex: 5 }}>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Board',{boardName : 'Board1'})}>
            <View>
              <Text style={{fontSize: 20, 
              color: 'black',  
              marginVertical: 10, 
              marginHorizontal: 30 
          }}>Board1</Text>
            </View>
        </TouchableWithoutFeedback>
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


export default HomeScreen;