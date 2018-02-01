import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text, TouchableWithoutFeedback } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import GroupScreen from './GroupScreen';
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

   static navigationOptions = {
    //title: 'Login',
   }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
        	<View style={{ marginVertical: 20, 
            marginHorizontal: 20,
            //width: 125, 
            height: 50,
            flex: 2.75
          }}>
        		<Button
          			onPress={() => Alert.alert('Create Group!')}
          			//onPress={() => NavigationActions.back()}
          			title="Create Group"
        		/>
      		</View>

          <View style={{ flex: 1 }}>
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginHorizontal: 10, 
            //width: 40, 
            height: 50,
            flex: 1
          }}>
            <Button
                onPress={() => Alert.alert('My Info!')}
                //onPress={() => NavigationActions.back()}
                title="Info"
            />
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginLeft: 10,
            marginRight: 20, 
            //width: 60, 
            height: 50,
            flex: 1.5
          }}>
            <Button
                onPress={() => Alert.alert('Logout!')}
                //onPress={() => NavigationActions.back()}
                title="Logout"
            />
          </View>
        </View>
        <View style = {{flex: 1 }}>
          <Text style={{fontSize: 30, 
            color: 'grey',  
            marginVertical: 20, 
            marginHorizontal: 20 
          }}>Group List</Text>
        </View>
        <View style = {{flex: 5 }}>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Group',{groupName : 'GroupA'})}>
            <View>
              <Text style={{fontSize: 20, 
              color: 'black',  
              marginVertical: 10, 
              marginHorizontal: 30 
          }}>GroupA</Text>
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