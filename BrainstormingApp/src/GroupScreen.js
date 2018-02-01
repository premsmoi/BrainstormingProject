import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text, TouchableWithoutFeedback } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';

class GroupScreen extends Component {
  
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.groupName,
  });

 
  render() {
    //const {state} = this.props.navigation;
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
          			onPress={() => Alert.alert('Create Topic!')}
          			//onPress={() => NavigationActions.back()}
          			title="Create Topic"
        		/>
      		</View>

          <View style={{ flex: 3 }}>
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginHorizontal: 20, 
            //width: 40, 
            height: 50,
            flex: 3
          }}>
            <Button
                onPress={() => Alert.alert('Members!')}
                //onPress={() => NavigationActions.back()}
                title="Members"
            />
          </View>
        </View>
        <View style = {{flex: 1 }}>
          <Text style={{fontSize: 30, 
            color: 'grey',  
            marginVertical: 20, 
            marginHorizontal: 20 
          }}>Topic List</Text>
        </View>
        <View style = {{flex: 5 }}>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Topic',{topicName : 'Active Learning'})}>
            <View>
              <Text style={{fontSize: 20, 
              color: 'black',  
              marginVertical: 10, 
              marginHorizontal: 30 
              }}>Active Learning</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

export default GroupScreen;