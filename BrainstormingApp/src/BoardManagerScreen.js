import React, { Component } from 'react';
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
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Picker,
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import GroupScreen from './GroupScreen';
import styles from "./app.style";
import Modal from "react-native-modal";
import {ip} from './Configuration';


//const ip = '10.0.2.2:8080'
//const ip = '192.168.43.143:8080'

class BoardManagerScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Board Manager'
  });
   
  constructor(props) {
    super(props);
    this.state = {
      newTag: '',
      visibleNewTagModal: false,
      visibleInviteModal: false,
      tagList: [],
      members: [],
      mode: this.props.navigation.state.params.board.mode,
      openWebSocket: false,
      setTime: this.props.navigation.state.params.board.limitedTime,
      numberOfVote: 1,
    }

    this.ws = new WebSocket('ws://'+ip, 'echo-protocol');

    this.ws.onmessage = (e) => {
      // a message was received
      var obj = JSON.parse(e.data)
    
      if(obj.body.code == 'getTags'){
        this.setState({tagList: obj.body.tags})
        console.log('tagList: '+obj.body.tags)
      }

      if(obj.body.code == 'getMembers'){
        console.log('members: '+obj.body.members)
        this.setState({members: obj.body.members})
      }
      
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    this.ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
      console.log('Closed!')
    };

    this.ws.onopen = () => {
      // connection opened
      this.setState({openWebSocket: true})
      this.getMembers()

      var tagClientRequest = {
        from: 'BoardManager',
        code: 'tagBoardManager',
        username: this.props.navigation.state.params.user.username,
        boardId: this.props.navigation.state.params.boardId
      }
      var requestString = JSON.stringify(tagClientRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)

      var getTagsRequest = {
        from: 'BoardManager',
        code: 'boardGetTags',
        boardId: this.props.navigation.state.params.boardId
      }
      var requestString = JSON.stringify(getTagsRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)
     
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
   this.ws.close()
      this.props.navigation.navigate('Board',
        { 
          user: this.props.navigation.state.params.user, 
          boardId: this.props.navigation.state.params.boardId, 
          boardName: this.props.navigation.state.params.boardName 
        }
      )
    return true;
  }

  createNewTag(){
    var newTagRequest = {
        from: 'BoardManager',
        code: 'boardAddTag',
        tag: this.state.newTag,
        boardId: this.props.navigation.state.params.boardId
      }
      var requestString = JSON.stringify(newTagRequest)
      console.log('New Tag Request')
      this.ws.send(requestString)
  }

  deleteTag(tag){
    var deleteTagRequest = {
        from: 'BoardManager',
        code: 'boardDeleteTag',
        tag: tag,
        boardId: this.props.navigation.state.params.boardId
      }
    var requestString = JSON.stringify(deleteTagRequest)
    console.log('Delete Tag Request')
    this.ws.send(requestString)

    //Alert.alert('delete '+tag)
  }


  async getMembers(){
     var getMembersRequest = {
        from: 'BoardManager',
        code: 'getMembers',
        boardId: this.props.navigation.state.params.boardId
      }
      var requestString = JSON.stringify(getMembersRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)
  }


  

   _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

   _renderTextInput = (placeholder, onChange, value) => (
    <View>
      <TextInput
          style={{
            height: 36, 
            width: 100,
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
          value = {value}
      />
    </View>
  )


  _renderNewTagModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      {this._renderTextInput('Tag Name', (newTag) => this.setState({newTag}))}
   
      <View style = { { flexDirection: 'row' } }>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Create", () => {
            this.setState({ visibleNewTagModal: false })
            this.createNewTag()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {this._renderButton("Cancel", () => {
            this.setState({ visibleNewTagModal: false })
            this.setState({newTag: ''})
            }
          )}

        </View>
        <View style = {{flex: 1}}/>
      </View>
    </View>
  )

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
        <Modal isVisible={this.state.visibleNewTagModal}>
          {this._renderNewTagModal()}
        </Modal>
        <View style={{flex: 1, flexDirection: 'row'}}>
        	<View style={{ marginVertical: 20, 
            marginHorizontal: 20,
            //width: 125, 
            height: 50,
            flex: 2
          }}>
            {this._renderButton("Add tag", () => {
            this.setState({visibleNewTagModal: true})
            })}
      		</View>

          <View style={{ marginVertical: 20, 
            marginHorizontal: 20,
            //width: 125, 
            height: 50,
            flex: 2
          }}>
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginHorizontal: 10, 
            //width: 40, 
            height: 50,
            flex: 1.5
          }}>
          </View>

          <View style={{ 
            marginVertical: 20, 
            marginLeft: 10,
            marginRight: 20, 
            //width: 60, 
            height: 50,
            flex: 1.5
          }}>
            {
              this._renderButton("Back", () => {
                this.props.navigation.navigate(
                  'Board', {
                    user: this.props.navigation.state.params.user,
                    boardId: this.props.navigation.state.params.boardId,
                    boardName: this.props.navigation.state.params.boardName
                  }
                )
                var updateBoardRequest = {
                  from: 'BoardManager',
                  code: 'updateBoard',
                  boardId: this.props.navigation.state.params.boardId,
                  setTime: this.state.setTime,
                  mode: this.state.mode,
                  numberOfVote: this.state.numberOfVote,
                }
                var requestString = JSON.stringify(updateBoardRequest)
                console.log('Set Board Time Request')
                this.ws.send(requestString)
                this.setState({
                  openWebSocket: false
                })
                this.ws.close()
              })
            }
          </View>
        </View>
        <View style = {{flex: 2 }}>
          <Text style={{fontSize: 20, 
            color: 'grey',  
            marginVertical: 5, 
            marginHorizontal: 20 
          }}>Mode</Text>
          <View style = {{flexDirection: 'row', marginLeft: 20}}>
            <View style = {{flex: 1 }}>
              <Picker selectedValue = {this.state.mode} onValueChange = {(mode) => {this.setState({mode: mode})}}>
                <Picker.Item label = "None" value = "none" />
                <Picker.Item label = "Timing" value = "timing" />
                <Picker.Item label = "Goal" value = "goal" />
              </Picker>
            </View>
            <View style = {{flex: 3}}/>
          </View>
          <View style = {{marginLeft: 20}}>
            {
              this.state.mode == 'timing' && (
                <View>
                  <View style = {{flexDirection: 'row', marginLeft: 20}}>
                    <View style = {{flexDirection: 'row', flex: 1}}>
                      <View style={{borderWidth: 3, borderColor: 'white'}}>
                        <Text style = {{fontSize: 16, textAlign: 'center'}}>Time: </Text>
                      </View>
                      {
                        <TextInput
                          style={{
                            height: 36, 
                            width: 50,
                          }}
                          placeholderTextColor = 'gray'
                          placeholder = 'Input'
                          onChangeText= {(setTime) => this.setState({setTime})}
                          value = {String(this.state.setTime)}
                        />
                      }
                    </View>
                    <View style = {{flex: 1}}>
                      
                    </View>
                    <View style = {{flex: 1}}/>
                  </View>
                </View>
                )
            }
          </View>
        </View>
        <View style = {{flex: 1 }}>
         <Text style={{fontSize: 20, 
            color: 'grey',  
            marginVertical: 5, 
            marginHorizontal: 20 
          }}>Vote</Text>
          <View style = {{marginLeft: 20}}>
           
                  <View style = {{flexDirection: 'row', marginLeft: 20}}>
                    <View style = {{flexDirection: 'row', flex: 1}}>
                      <View style={{borderWidth: 3, borderColor: 'white'}}>
                        <Text style = {{fontSize: 16, textAlign: 'center'}}>Number of vote: </Text>
                      </View>
                      {
                        <TextInput
                          style={{
                            height: 36, 
                            width: 50,
                          }}
                          placeholderTextColor = 'gray'
                          placeholder = 'Input'
                          onChangeText= {(numberOfVote) => this.setState({numberOfVote})}
                          value = {String(this.state.numberOfVote)}
                        />
                      }
                    </View>
                    <View style = {{flex: 1}}>
                      
                    </View>
                    <View style = {{flex: 1}}/>
                  </View>
                </View>
          </View>
        <View style = {{flex: 5 }}>
          <Text style={{fontSize: 20, 
            color: 'grey',  
            marginVertical: 5, 
            marginHorizontal: 20 
          }}>Tags</Text>
          {this.state.tagList.map((tag) => {
            return(
                <View style={{flexDirection: 'row'}} key = {tag} >
                  <TouchableWithoutFeedback 
                    onPress={() => {
                      this.deleteTag(tag)
                     }
                    }
                  >
                  <Image
                    style={{width: 16, height: 16, marginTop: 8, marginLeft: 30}}
                    source={require('../img/cross.png')}
                  />
                  </TouchableWithoutFeedback>
                  <Text 
                    style={{
                      fontSize: 18, 
                      color: 'black',  
                      marginVertical: 5,
                      marginLeft: 10,
                    }}>
                      {tag}
                  </Text>
              </View>
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


export default BoardManagerScreen;