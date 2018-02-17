import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import GroupScreen from './GroupScreen';
import styles from "./app.style";
import Modal from "react-native-modal";

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.user.name,
  });
   
  constructor(props) {
    super(props);
    this.state = {
      myBoards: [],
      newBoardName: '',
      visibleNewBoardModal: false,
      createSuccess: false,
      newBoardId: null,
    }
    this.getUser()
    //console.log(this.props.navigation.state.params.user)
  }

  async getUser(){
    console.log('exec getUser')
    var params = {
      username: this.props.navigation.state.params.user.username
    }

    try{
      let response = await fetch('http://10.0.2.2:8080/get_user', {
          //fetch('http://192.168.43.143:8080/register', {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })
      var user = JSON.parse(response._bodyText)
          //console.log(user)
      this.setState({myBoards: user.boards})
    } catch (error) {
        throw error;
      }
  }

  async createNewBoard(){
    console.log('createNewBoard')

    var params = {
      creator: this.props.navigation.state.params.user.username,
      boardName: this.state.newBoardName,
    }

    try{
      let response = await fetch('http://10.0.2.2:8080/create_board', {
    //fetch('http://192.168.43.143:8080/register', {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })

        var body = JSON.parse(response._bodyText);
          //console.log('body: '+body)
          //console.log(body['status'])
          if(body['status']==0){
            var errMsg = ''
            for(i=0;i<body['errors'].length;i++){
              errMsg = errMsg + body['errors'][i] + '\n';
            }
            Alert.alert(
              'Alert',
              errMsg,
              [
                {text: 'OK',},
              ],
              { cancelable: false }
            )
          }
          else{
            Alert.alert(
              'Alert',
              'Create Board complete',
              [
                {text: 'OK',},
              ],
              { cancelable: false }
            );
            this.setState({createSuccess: true, newBoardId:  body['newBoardId']})
            
            //console.log('newBoardId: '+body['newBoardId'])
          }
    } catch (error) {
        throw error;
      }
    
        
    console.log('createSuccess: '+this.state.createSuccess)
    console.log('newBoardId: '+this.state.newBoardId)
    if(this.state.createSuccess){
      console.log('Here')
      params = {
        username: this.props.navigation.state.params.user.username,
        newBoardId: this.state.newBoardId,
        newBoardName: this.state.newBoardName,
      }
      try{
        let response = await fetch('http://10.0.2.2:8080/user_add_board', {
              //fetch('http://192.168.43.143:8080/register', {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                  "Content-Type": "application/json"
                },
                credentials: "same-origin"
              })
        console.log('response: '+response)
      } catch (error) {
          console.log(error)
        }
      console.log('Above')
      this.setState({newBoardName: ''})
      this.setState({visibleNewBoardModal: false})
      await this.getUser()
      console.log('Below')
    }   
  }

  logout() {
    console.log(this.props.navigation.state.params.user.username+' -> Logout');
    fetch('http://10.0.2.2:8080/logout')
    //fetch('http://192.168.43.143:8080/logout')
    .then((response) => {
      this.props.navigation.navigate('Login')
      //console.log(response);
      return response.json()
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
  )

   _renderTextInput = (placeholder, onChange) => (
    <View>
      <TextInput
          style={{
            height: 40, 
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
      />
    </View>
  )



   _renderNewBoardModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      {this._renderTextInput('Board Name', (newBoardName) => this.setState({newBoardName}))}
   
      <View style={{flexDirection: 'row'}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Create", () => {
            this.createNewBoard()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => {
            this.setState({ visibleNewBoardModal: false })
            this.setState({newBoardName: ''})
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
        <Modal isVisible={this.state.visibleNewBoardModal}>
            {this._renderNewBoardModal()}
        </Modal>
        <View style={{flex: 1, flexDirection: 'row'}}>
        	<View style={{ marginVertical: 20, 
            marginHorizontal: 20,
            //width: 125, 
            height: 50,
            flex: 2.5
          }}>
            {this._renderButton("Create Board", () => this.setState({visibleNewBoardModal:true}))}
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
            {this._renderButton("Info", () => {  
              Alert.alert('My Info!')
              }
            )}
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
          {this.state.myBoards.map((board) => {
            return(
              <TouchableWithoutFeedback 
                onPress={() => 
                  this.props.navigation.navigate('Board',{user: this.props.navigation.state.params.user, boardName : board.boardName, boardId : board.boardId})
                }
                key = {board.boardId}  
              >
                <View>
                  <Text 
                    style={{
                      fontSize: 20, 
                      color: 'black',  
                      marginVertical: 10, 
                      marginHorizontal: 30 
                    }}>
                      {board.boardName}
                  </Text> 
                </View>
              </TouchableWithoutFeedback>
            )
          })}
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