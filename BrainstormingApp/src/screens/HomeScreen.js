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
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  BackHandler,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  StackNavigator,
  NavigationActions
} from 'react-navigation';
import styles from "./../app.style";
import {renderButton, renderIconButton} from './../RenderUtilities';
import Modal from "react-native-modal";
import {
  navBarColor,
} from './../colors'
import {
  ip
} from './../Configuration';
import App from '../App'

import { LoginButton, LoginManager, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';


class HomeScreen extends Component {

  static navigationOptions = ({
    navigation
  }) => ({
    title: App.getAppUser().username,
  });

  static navigatorStyle = {
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarBackgroundColor: 'blue',
  };

  constructor(props) {
    super(props);
    this.totalLoad = 2;
    this.currentLoad = 0;
    this.state = {
      myBoards: [],
      newBoardName: '',
      visibleNewBoardModal: false,
      visibleBoardDetailModal: false,
      visibleInviteModal: false,
      visibleNotificationModal: false,
      createSuccess: false,
      newBoardId: null,
      changeBoardName: '',
      showDetailBoard: {
        boardName: '',
        members: []
      },
      usernameSearchResult: [],
      selectedUserToInvite: '',
      usernameSearchQuery: '',
      numberOfUnreadNotification: 0,
      notifications: [],
      loadSucceed: false,
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.ws = App.getAppWebSocket()
    this.ws.onmessage = (e) => {
      // a message was received
      //console.log("e.data: "+e.data);
      var obj = JSON.parse(e.data)
      //console.log(obj.body.notes)
      if (obj.body.code == 'getBoardList') {
        console.log('I got board list')
        this.setState({
          myBoards: obj.body.boards,
        })
        this.currentLoad++;

      }

      if (obj.body.code == 'getBoardListTrigger') {
        console.log('I got board trigger')
        this.getBoards();
      }

      if (obj.body.code == 'getUserTrigger') {
        console.log('I got user trigger')
        this.getUser();
      }

      if (obj.body.code == 'getNotification') {
        console.log('I got notification')
        console.log('notification: ' + JSON.stringify(obj.body.notifications))
        this.setState({
          notifications: obj.body.notifications,
        }, () => {
          this.setState({
            numberOfUnreadNotification: this.countUnreadNotification(),
          })
        })
        this.currentLoad++;
      }

      if (obj.body.code == 'getNotificationTrigger') {
        console.log('I got notification trigger')
        this.getNotification()
      }
      if(this.isLoadingSuccessful()){
        this.setState({loadSucceed: true})
        console.log('Loading is successful!')
      }

    };

    var tagClientRequest = {
      from: 'Home',
      code: 'tagUser',
      username: App.getAppUser().username,
    }
    var requestString = JSON.stringify(tagClientRequest)
    this.ws.send(requestString)
    this.getNotification()
    this.getBoards();

    console.log('I am ' + this.state.user)

  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    BackHandler.exitApp()
    return true;
  }

  isLoadingSuccessful(){
    if(this.currentLoad == this.totalLoad){
      this.currentLoad = 0
      return true;
    }
    return false;
  }

  async getUser() {
    console.log('exec getUser')
    var params = {
      username: App.getAppUser().username
    }

    try {
      let response = await
      //fetch('http://10.0.2.2:8080/get_user', {
      fetch('http://' + ip + '/get_user', {
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
      App.setAppUser(user);

    } catch (error) {
      throw error;
    }
  }

  getBoards() {
    console.log('exec get boards')
    var board_id_list = []
    App.getAppUser().boards.map(function(board) {
      board_id_list.push(board.boardId)
    })
    var getBoardsRequest = {
      from: 'Home',
      code: 'getBoardList',
      board_id_list: board_id_list,
    }
    var requestString = JSON.stringify(getBoardsRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  async createNewBoard() {
    console.log('createNewBoard')

    var params = {
      creator: App.getAppUser().username,
      boardName: this.state.newBoardName,
    }

    try {
      let response = await
      //fetch('http://10.0.2.2:8080/create_board', {
      fetch('http://' + ip + '/create_board', {
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
      if (body['status'] == 0) {
        var errMsg = ''
        for (i = 0; i < body['errors'].length; i++) {
          errMsg = errMsg + body['errors'][i] + '\n';
        }
        Alert.alert(
          'Alert',
          errMsg, [{
            text: 'OK',
          }, ], {
            cancelable: false
          }
        )
      } else {
        Alert.alert(
          'Alert',
          'Create Board complete', [{
            text: 'OK',
          }, ], {
            cancelable: false
          }
        );
        this.setState({
          createSuccess: true,
          newBoardId: body['newBoardId']
        })

        //console.log('newBoardId: '+body['newBoardId'])
      }
    } catch (error) {
      throw error;
    }


    console.log('createSuccess: ' + this.state.createSuccess)
    console.log('newBoardId: ' + this.state.newBoardId)
    if (this.state.createSuccess) {
      console.log('Here')
      params = {
        username: App.getAppUser().username,
        newBoardId: this.state.newBoardId,
      }
      try {
        let response = await
        //fetch('http://10.0.2.2:8080/user_add_board', {
        fetch('http://' + ip + '/user_add_board', {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })
        console.log('response: ' + response)
      } catch (error) {
        console.log(error)
      }
      console.log('Above')
      this.setState({
        newBoardName: ''
      })
      this.setState({
        visibleNewBoardModal: false
      })
      //await this.getUser()
      await this.getUser();
      await this.getBoards();
      console.log('Below')
    }
  }

  logout() {
    console.log(App.getAppUser().username + ' -> Logout');
    //fetch('http://10.0.2.2:8080/logout')
    fetch('http://' + ip + '/logout')
      .then((response) => {
        this.props.navigation.navigate('Login')
        //console.log(response);
        return response.json()
      })
      .catch((error) => {
        throw error;
      });
      LoginManager.logOut();
  }

  async updateBoardName() {
    var params = {
      boardId: this.state.showDetailBoard._id,
      boardName: this.state.changeBoardName,
    }

    try {
      response = await
      //fetch('http://10.0.2.2:8080/board_update_name', {
      fetch('http://' + ip + '/board_update_name', {
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

  deleteBoard() {
    var deleteBoardRequest = {
      from: 'Home',
      code: 'deleteBoard',
      boardId: this.state.showDetailBoard._id,
    }
    var requestString = JSON.stringify(deleteBoardRequest)
    console.log('I delete board!!!')
    this.ws.send(requestString)
  }
 
  countUnreadNotification() {
    var count = 0
    console.log('test notification: ' + this.state.notifications)
    this.state.notifications.map(function(notification) {
      if (!notification.read) {
        count++
      }
    })
    console.log('count: ' + count)
    return count
  }

  acceptInvite(notification) {
    var acceptInviteRequest = {
      from: 'Home',
      code: 'acceptInvite',
      username: App.getAppUser().username,
      boardId: notification.boardId,
      boardName: notification.boardName,
    }
    var requestString = JSON.stringify(acceptInviteRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  getNotification() {
    var getNotificationRequest = {
      from: 'Home',
      code: 'getNotification',
      username: App.getAppUser().username,
    }
    var requestString = JSON.stringify(getNotificationRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
  }

  readNotification(notification) {
    var readNotificationRequest = {
      from: 'Home',
      code: 'readNotification',
      id: notification._id,
      username: App.getAppUser().username,
    }
    var requestString = JSON.stringify(readNotificationRequest)
    //console.log('props: '+this.props)
    this.ws.send(requestString)
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

   _renderNavBar = () => (
    <View style = {{
      flexDirection: 'row',
      backgroundColor: navBarColor,
    }}>
      <View style={{ 
        marginVertical: 10,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        
      </View>
        <View style={{ 
          marginVertical: 5, 
          marginHorizontal: 10,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({visibleNotificationModal: true})}
              >
                <ImageBackground
                  style={{width: 24, height: 24, marginVertical: 5, marginHorizontal: 10}}
                  source={require('../../img/message.png')}
                >
                  {
                    this.state.numberOfUnreadNotification > 0 && (
                      <View style = {{
                        width: this.state.numberOfUnreadNotification > 9? 22 : 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: 'red',
                        marginLeft: 20,
                      }}>
                        <Text style={{
                          fontSize: 10, 
                          color: 'white',  
                          //marginVertical: 20, 
                          marginHorizontal: 5,
                        }}>
                          {this.state.numberOfUnreadNotification}
                        </Text>
                      </View>
                      )
                  }
                  
                </ImageBackground>
              </TouchableWithoutFeedback>
              <View style = {{marginHorizontal: 10}}>
                {renderIconButton(require('../../img/user.png'), () => this.props.navigation.navigate('UserProfile'))}
              </View>
              {renderIconButton(require('../../img/logout.png'), () => this.logout())}
            </View>
      </View>
    )

   _renderBoardList =() => (
      <View>
      {this.state.myBoards.map((board) => {
                return(
                  <TouchableHighlight 
                    onPress={() => {
                      this.setState({ visibleBoardDetailModal: false })
                      this.setState({changeBoardName: ''})
                      this.props.navigation.navigate('Board', { boardId: board._id})
                      }
                    }
                    onLongPress = {() => {
                      this.setState({showDetailBoard: board})
                      this.setState({changeBoardName: board.boardName})
                      this.setState({visibleBoardDetailModal: true})
                      //this.props.navigation.navigate('Board',{user: this.props.navigation.state.params.user, boardName : board.boardName, boardId : board.boardId})
                      }}
                    key = {board._id}
                    underlayColor = {'#f2f2f2'}  
                  >
                    <View style = {{
                      borderColor: '#f4f4f4',
                      borderWidth: 0.5, 
                    }}>
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
                  </TouchableHighlight>
                )
              })}
              <TouchableWithoutFeedback
                onPress = {() => this.setState({visibleNewBoardModal: true})}
              >
                <View style = {{marginHorizontal: 30,}}>
                  <Text style = {{fontSize: 16, color: '#70cdef'}}>
                    New Board
                  </Text>
                </View>
              </TouchableWithoutFeedback>
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
          {renderButton("Create", () => {
            this.createNewBoard()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {renderButton("Cancel", () => {
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
      <View style = {{flexDirection: 'row'}}>
        <View style={{borderWidth: 3, borderColor: 'white'}}>
        </View>
        <View style ={{width: 150}}>
        </View>
        <View>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {renderButton("OK", () => {
            this.setState({ visibleBoardDetailModal: false })
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {renderButton("Delete", () => {
            this.setState({ visibleBoardDetailModal: false })
            this.deleteBoard();
            }
          )}
        </View>
        <View style = {{flex: 1}}/>
      </View>
    </View>
  )

  _renderNormalNotification = (notification) => (
    <TouchableWithoutFeedback
      onPress={() => this.readNotification(notification)}
    >  
      <View style=
        {{ 
          flexDirection: 'row',
          backgroundColor: notification.read == true? 'white' : '#d9d9d9'
        }} 
        key = {notification} >
        <View style={{
          flex: 1,
          borderColor: 'gray',
          borderWidth: 1,
        }}>
          <Text 
            style={{
              fontSize: 18, 
              color: 'black', 
              marginVertical: 5,
              marginHorizontal: 5,
            }}>
              {notification.detail}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )

  _renderReplyNotification = (notification) => (
      <View style={{
        flexDirection: 'column',
        backgroundColor: notification.read == true? 'white' : '#d9d9d9',
        borderColor: 'gray',
        borderWidth: 1,
      }} 
        key = {notification} >
        <View style={{
        }}>
          <Text 
            style={{
              fontSize: 18, 
              color: 'black', 
              marginVertical: 5,
              marginHorizontal: 5,
            }}>
              {notification.detail}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {
            notification.read == false
            && renderButton("Accept", () => {
              this.readNotification(notification)
              this.acceptInvite(notification)
            })
          }
          {
            notification.read == false
            && renderButton("Decline", () => this.readNotification(notification))
          }
        </View>
      </View>
    )

  _renderNotificationModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      <View style = {{height: 300}}>
        <ScrollView>
          {this.state.notifications.map((notification) => {
            
              //Alert.alert(notification.notificationType)

              //notification.notificationType == 'normal' && this._renderNormalNotification(notification)
              //notification.notificationType == 'reply' &&
              if(notification.notificationType == 'reply'){
                return (
                 this._renderReplyNotification(notification)
                )
              }
              else {
                return(
                  this._renderNormalNotification(notification)
                )
              }
              
            
              //&& this._renderReplyNotification(notification)
          })}
          { this.state.notifications.length == 0 
            && (
              <View style = {{justifyContent: 'center', alignItems: 'center', marginVertical: 100}}>
                <Text style = {{fontSize: 30}}>Empty</Text>
              </View>
            )}
        </ScrollView>
      </View>
      <View style={{
        backgroundColor: 'white',
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        //borderRadius: 4,
      }}>  
        {renderButton("OK", () => {
          this.setState({ visibleNotificationModal: false })
        })}
      </View>
    </View>
  )

  render() {
    console.log('render')
    if(this.state.loadSucceed){
      return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
        <ScrollView keyboardShouldPersistTaps = {'always'}  scrollEnabled = {false}>
          <Modal isVisible={this.state.visibleNewBoardModal}>
              {this._renderNewBoardModal()}
          </Modal>
          <Modal isVisible={this.state.visibleBoardDetailModal}>
              {this._renderBoardDetailModal()}
          </Modal>
          <Modal isVisible={this.state.visibleNotificationModal}>
              {this._renderNotificationModal()}
          </Modal>
          <View style={{
            flex: 1, 
          }}>
            {this._renderNavBar()}
          </View>
          <View style = {{
            flex: 1,
          }}>
            <Text style={{
              fontSize: 30, 
              color: 'grey',  
              marginVertical: 5, 
              marginHorizontal: 10 
            }}>My Boards</Text>
          </View>

          <View style = {{
            flex: 14,
          }}>
            {this._renderBoardList()}
          </View>
        </ScrollView>
      </View>
    );
  }
  else {
    return(
      <View style = {{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <Text>Loading..</Text>
      </View>
    )
  }
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