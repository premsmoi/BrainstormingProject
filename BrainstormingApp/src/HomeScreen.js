import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import GroupScreen from './GroupScreen';
import styles from "./app.style";
import Modal from "react-native-modal";

//const ip = '10.0.2.2:8080'
const ip = '192.168.43.143:8080'

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.user.name,
  });
   
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user,
      myBoards: [],
      newBoardName: '',
      visibleNewBoardModal: false,
      visibleBoardDetailModal: false,
      visibleInviteModal: false,
      createSuccess: false,
      newBoardId: null,
      changeBoardName: '',
      showDetailBoard: {boardName: '', members: []},
      usernameSearchResult: [],
      selectedUserToInvite: '',
      usernameSearchQuery: '',
    }
    //this.getUser()
    this.getBoards();
    console.log('I am '+this.state.user)
  }

  async getUser(){
    console.log('exec getUser')
    var params = {
      username: this.state.user.username
    }

    try{
      let response = await 
          //fetch('http://10.0.2.2:8080/get_user', {
          fetch('http://'+ip+'/get_user', {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })
      var user = JSON.parse(response._bodyText)
          //console.log(user)
      //this.setState({myBoards: user.boards})
      this.setState({user: user})

    } catch (error) {
        throw error;
      }
  }

  async getBoards(){
    var params = {
      idList: this.state.user.boards
    }
    console.log('id_list: '+JSON.stringify(this.state.user.boards))

    try{
      let response = await 
          //fetch('http://10.0.2.2:8080/get_board_list', {
          fetch('http://'+ip+'/get_board_list', {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })

      var body = JSON.parse(response._bodyText)
      var boardList = body['boardList']
      //console.log(response._bodyText)
      this.setState({myBoards: boardList})
    } catch (error) {
        console.log(error)
      }
  }

  async createNewBoard(){
    console.log('createNewBoard')

    var params = {
      creator: this.state.user.username,
      boardName: this.state.newBoardName,
    }

    try{
      let response = await 
        //fetch('http://10.0.2.2:8080/create_board', {
          fetch('http://'+ip+'/create_board', {
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
        username: this.state.user.username,
        newBoardId: this.state.newBoardId,
      }
      try{
        let response = await 
              //fetch('http://10.0.2.2:8080/user_add_board', {
              fetch('http://'+ip+'/user_add_board', {
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
      //await this.getUser()
      await this.getUser();
      await this.getBoards();
      console.log('Below')
    }   
  }

  logout() {
    console.log(this.state.user.username+' -> Logout');
    //fetch('http://10.0.2.2:8080/logout')
    fetch('http://'+ip+'/logout')
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

  async updateBoardName(){
    var params = {
      boardId: this.state.showDetailBoard._id,
      boardName: this.state.changeBoardName,
    }

    try{
        response = await 
              //fetch('http://10.0.2.2:8080/board_update_name', {
              fetch('http://'+ip+'/board_update_name', {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                  "Content-Type": "application/json"
                },
                credentials: "same-origin"
              })
        console.log('update board name')
      } catch (error) {
          console.log(error)
        }
        await this.getBoards();
        //this.getUser();
  }

  async deleteBoard(){
    var params = {
      boardId: this.state.showDetailBoard._id,
    }

    try{
        response = await 
              //fetch('http://10.0.2.2:8080/delete_board', {
              fetch('http://'+ip+'/delete_board', {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                  "Content-Type": "application/json"
                },
                credentials: "same-origin"
              })
        console.log('pass delete board')
        //console.log('response: '+response)
      } catch (error) {
          console.log(error)
        }

    try{
        response = await 
              //fetch('http://10.0.2.2:8080/user_delete_board', {
              fetch('http://'+ip+'/user_delete_board', {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                  "Content-Type": "application/json"
                },
                credentials: "same-origin"
              })
          console.log('pass user delete board')
        //console.log('response: '+response)
      } catch (error) {
          console.log(error)
        }

    try{
        response = await 
              //fetch('http://10.0.2.2:8080/delete_notes', {
              fetch('http://'+ip+'/delete_notes', {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                  "Content-Type": "application/json"
                },
                credentials: "same-origin"
              })
        console.log('pass delete notes')
        //console.log('response: '+response)
      } catch (error) {
          console.log(error)
        }
    await this.getUser();
    await this.getBoards();
  }

  async searchUsername(){
    var params = {
      username: this.state.usernameSearchQuery,
    }

    try{
      let response = await 
          //fetch('http://10.0.2.2:8080/get_board_list', {
          fetch('http://'+ip+'/search_users', {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })

      var body = JSON.parse(response._bodyText)
      var userList = body
      var usernameList = []

      userList.map((user) => {
        usernameList.push(user.username)
      })

      //console.log(response._bodyText)
      this.setState({usernameSearchResult: usernameList})
    } catch (error) {
        console.log(error)
      }
  }

  async inviteUser(username){
    params = {
        username: this.state.selectedUserToInvite,
        boardId: this.state.showDetailBoard._id,
      }
      try{
        let response = await 
              //fetch('http://10.0.2.2:8080/user_add_board', {
              fetch('http://'+ip+'/board_add_member', {
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

      params = {
        username: this.state.selectedUserToInvite,
        newBoardId: this.state.showDetailBoard,
      }
      try{
        let response = await 
              //fetch('http://10.0.2.2:8080/user_add_board', {
              fetch('http://'+ip+'/user_add_board', {
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
  }

   _renderTextInput = (placeholder, onChange, value) => (
    <View>
      <TextInput
          style={{
            height: 36, 
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
          value = {value}
      />
    </View>
  )

   _renderInviteModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{borderWidth: 3, borderColor: 'white'}}>
            <Text style={{fontSize: 16, textAlign: 'center'}}>Search username : </Text>
          </View>
          {this._renderTextInput('Search Input', 
            (usernameSearchQuery) => { this.setState({usernameSearchQuery})},
            this.state.usernameSearchQuery
          )}
          <View>
            {this._renderButton("Search", () => {this.searchUsername()})}
          </View>
        </View>
        <View style={{}}>
            {this.state.usernameSearchResult.map((username) => {
              return(
                  <TouchableWithoutFeedback
                    onPress = {() => {this.setState({selectedUserToInvite: username})}}
                    key = {username}
                  >
                    <View style = {{backgroundColor: username==this.state.selectedUserToInvite ? 'lightblue':'white'}}>
                      <Text 
                        style={{
                          fontSize: 16, 
                          color: 'black',  
                          marginVertical: 4, 
                          marginHorizontal: 8 
                        }}
                      >
                          {username}
                      </Text> 
                    </View>
                  </TouchableWithoutFeedback>
              )
            })}
        </View>
        <View style={{flexDirection: 'row'}}>
          <View>
            {this._renderButton("Invite", () => {
              this.setState({visibleInviteModal: false})
              this.inviteUser()
            })
            }
          </View>
          <View>
            {this._renderButton("Close", () => {
              this.setState({visibleInviteModal: false, 
                usernameSearchQuery: '', 
                usernameSearchResult: [],
                selectedUserToInvite: '',
              })
            })}
          </View>
        </View>
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
  )

   _renderBoardDetailModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      <View style={{flexDirection: 'row'}}>
        <View style={{borderWidth: 3, borderColor: 'white'}}>
          <Text style={{fontSize: 16, textAlign: 'center'}}>Board Name : </Text>
        </View>
        {this._renderTextInput('Board Name', 
          (changeBoardName) => { this.setState({changeBoardName})},
          this.state.changeBoardName
        )}
      </View>
      <View style = {{flexDirection: 'row'}}>
        <View style={{borderWidth: 3, borderColor: 'white'}}>
          <Text style={{fontSize: 16, textAlign: 'center'}}>Members : </Text>
        </View>
        <View style ={{width: 150}}>
          {this.state.showDetailBoard.members.map((member) => {
            return(
                <View>
                  <Text 
                    style={{
                      fontSize: 16, 
                      color: 'black',  
                      marginVertical: 4, 
                      marginHorizontal: 8 
                    }}
                    key = {member}
                    >
                      {member}
                  </Text> 
                </View>
            )
          })}
        </View>
        <View>
          <TouchableWithoutFeedback
            onPress = {() => {this.setState({visibleInviteModal: true})}}
          >
            <View>
              <Text 
                style={{
                  fontSize: 16, 
                  color: '#1ac6ff',  
                  marginVertical: 4, 
                  marginHorizontal: 8, 
                }}>
                  Invite
              </Text> 
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Enter", () => {
            this.setState({ visibleBoardDetailModal: false })
            this.setState({changeBoardName: ''})
            this.props.navigation.navigate('Board',{user: this.state.user, boardName : this.state.showDetailBoard.boardName, boardId : this.state.showDetailBoard._id})
            }
          )}
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Delete", () => {
            this.setState({ visibleBoardDetailModal: false })
            this.deleteBoard();
            //this.setState({changeBoardName: ''})
            }
          )}
        </View>
        <View style = {{flex: 1}}/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("OK", () => {
            this.setState({ visibleBoardDetailModal: false })
            this.updateBoardName()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => {
            this.setState({ visibleBoardDetailModal: false })
            this.setState({changeBoardName: ''})
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
        <Modal isVisible={this.state.visibleBoardDetailModal}>
            {this._renderBoardDetailModal()}
        </Modal>
        <Modal isVisible={this.state.visibleInviteModal}>
          {this._renderInviteModal()}
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
                onPress={() => {
                  this.setState({showDetailBoard: board})
                  this.setState({changeBoardName: board.boardName})
                  this.setState({visibleBoardDetailModal: true})
                  //this.props.navigation.navigate('Board',{user: this.props.navigation.state.params.user, boardName : board.boardName, boardId : board.boardId})
                  }
                }
                key = {board._id}  
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