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
  ScrollView,
  CheckBox,
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import styles from "./../app.style";
import {
  navBarColor,
} from './../colors'
import {renderButton, renderIconButton} from './../RenderUtilities'
import Modal from "react-native-modal";
import {ip, scale} from './../Configuration';
import App from '../App';

class BoardManagerScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Board Manager'
  });
   
  constructor(props) {
    super(props);
    this.state = {
      newTag: '',
      visibleNewTagModal: false,
      tagList: [],
      newBoardName: App.getAppBoard().boardName,
      description: App.getAppBoard().description,
      hasTime: App.getAppBoard().hasTime,
      hasGoal: App.getAppBoard().hasGoal,
      setTime: App.getAppBoard().limitedTime,
      goal: App.getAppBoard().goal,
      numberOfVote: App.getAppBoard().numberOfVote,
    }

    this.ws = App.getAppWebSocket()

    this.ws.onmessage = (e) => {
      // a message was received
      var obj = JSON.parse(e.data)
    
      if(obj.body.code == 'getTags'){
        this.setState({tagList: obj.body.tags})
        console.log('I got tags')
      }
    };
     
      var tagClientRequest = {
        from: 'BoardManager',
        code: 'tagBoardManager',
        username: App.getAppUser().username,
        boardId: App.getAppBoard()._id,
      }
      var requestString = JSON.stringify(tagClientRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)

      var getTagsRequest = {
        from: 'BoardManager',
        code: 'boardGetTags',
        boardId: App.getAppBoard()._id
      }
      var requestString = JSON.stringify(getTagsRequest)
      //console.log('props: '+this.props)
      this.ws.send(requestString)

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
          boardId: App.getAppBoard()._id, 
        }
      )
    return true;
  }

  createNewTag(){
    var newTagRequest = {
        from: 'BoardManager',
        code: 'boardAddTag',
        tag: this.state.newTag,
        boardId: App.getAppBoard()._id
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
        boardId: App.getAppBoard()._id
      }
    var requestString = JSON.stringify(deleteTagRequest)
    console.log('Delete Tag Request')
    this.ws.send(requestString)

    //Alert.alert('delete '+tag)
  };

   _renderTextBeforeTextInput = (text) => (
    <View>
      <Text style = {{
        fontSize: 16*scale,
        color: 'grey',
        marginVertical: 5*scale,
        marginRight: 5*scale
      }}>
      {text}
      </Text>
    </View>
    );

  _renderTextInput = (placeholder, onChange, value) => (
    <View>
      <TextInput
          style={{
            height: 36*scale, 
            width: 200*scale,
            fontSize: 16*scale
          }}
          placeholderTextColor = 'gray'
          placeholder = {placeholder}
          onChangeText={onChange}
          underlineColorAndroid = {'black'}
          value = {value}
      />
    </View>
  );


  _renderNewTagModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      justifyContent: "center",
      alignItems: "center",
      //borderRadius: 4,
    }}>
      {this._renderTextInput('Tag Name', (newTag) => this.setState({newTag}))}
   
      <View style = { { flexDirection: 'row' } }>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 3}}>
          {renderButton("Create", () => {
            this.setState({ visibleNewTagModal: false })
            this.createNewTag()
            })
          }
        </View>
        <View style = {{flex: 2}}/>
        <View style = {{flex: 3}}>
          {renderButton("Cancel", () => {
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
        <ScrollView keyboardShouldPersistTaps = {'always'}  scrollEnabled = {false}>
          <Modal isVisible={this.state.visibleNewTagModal}>
            {this._renderNewTagModal()}
          </Modal>
          <View style={{
            flexDirection: 'row',
            backgroundColor: navBarColor,
          }}>
          

            <View style={{
              flex: 1,
            }}/>
            <View style={{
              justifyContent: 'center',
              alignItems: 'flex-end', 
              flex: 1,
              marginVertical: 5, 
              marginHorizontal: 20,
            }}>
            <TouchableWithoutFeedback
              onPressIn={() => {
                  var updateBoardRequest = {
                    from: 'BoardManager',
                    code: 'updateBoard',
                    boardId: App.getAppBoard()._id,
                    updatedObj: {
                      hasTime: this.state.hasTime,
                      hasGoal: this.state.hasGoal,
                      limitedTime: parseInt(this.state.setTime),
                      timeRemaining: parseInt(this.state.setTime),
                      goal: this.state.goal,
                      mode: this.state.mode,
                      numberOfVote: this.state.numberOfVote,
                      boardName: this.state.newBoardName,
                      description: this.state.description,
                    }
                  }
                  if(App.getAppBoard().start){
                    updateBoardRequest = {
                    from: 'BoardManager',
                    code: 'updateBoard',
                    boardId: App.getAppBoard()._id,
                    updatedObj: {
                      numberOfVote: this.state.numberOfVote,
                      boardName: this.state.newBoardName,
                      description: this.state.description,
                    }
                  }
                  }
                  var requestString = JSON.stringify(updateBoardRequest)
                  //console.log('Set BoardManager Time Request')
                  this.ws.send(requestString)
                  setTimeout( () => {
                    this.props.navigation.navigate('Board', { boardId: App.getAppBoard()._id})
                  }, 0)
                }}
            >
              <View>
                <Text style = {{fontSize: 20*scale, color: 'black', marginVertical: 5, marginHorizontal: 10, alignItems: 'center'}}>
                  Back
                </Text>
              </View>
            </TouchableWithoutFeedback>
            </View>
          </View>
          <View style = {{
            marginVertical: 5, 
            marginLeft: 20 
          }}>
            <Text style={styles.headerText}>
              Board Setting
            </Text>
          </View>
          <View style = {{marginLeft: 30}}>
            <View style = {{flexDirection: 'row'}}>
              {this._renderTextBeforeTextInput('Board Name: ')}
              {this._renderTextInput('Input Board Name', (newBoardName) => this.setState({newBoardName}), String(this.state.newBoardName))}
            </View>
          </View>
          <View style = {{marginLeft: 30}}>
            <View style = {{flexDirection: 'row'}}>
              {this._renderTextBeforeTextInput('Description: ')}
              <TextInput
                style={{
                  marginTop: 10,
                  borderWidth: 0.5,
                  borderColor: 'gray',
                  width: 200*scale,
                  textAlignVertical: "top",
                  fontSize: 16*scale
                }}
                placeholderTextColor = 'gray'
                placeholder = 'Input Description'
                onChangeText= {(description) => this.setState({description})}
                value = {String(this.state.description)}
                //maxLength = {5}
                multiline = {true}
                numberOfLines = {3}
                underlineColorAndroid = {'white'}
                //textAlign={'center'}
              />
            </View>
          </View>
          <View style = {{
            marginLeft: 30,
          }}>
            <View style = {{
              flexDirection: 'row',
            }}>
              <CheckBox
                value={this.state.hasTime}
                onValueChange={() => this.setState({ hasTime: !this.state.hasTime })}
                disabled = {App.getAppBoard().start}
              />
              <Text style={{
                fontSize: 16*scale, 
                color: 'grey',  
                marginVertical: 5, 
                marginRight: 5 
              }}>
                Time:
              </Text>
              <TextInput
                style = {{
                    height: 36*scale,
                    width: 50*scale,
                    fontSize: 16*scale
                }}
                placeholderTextColor = 'gray'
                placeholder = 'Input'
                onChangeText = {
                  (setTime) => this.setState({
                    setTime
                  })
                }
                value = {String(this.state.setTime)}
                maxLength = {5}
                textAlign = {'center'}
                editable = {this.state.hasTime}
                underlineColorAndroid = {'black'}
              />
            </View>
            {/*
              <View style = {{
              flexDirection: 'row',
            }}>
              <CheckBox
                value={this.state.hasGoal}
                onValueChange={() => this.setState({ hasGoal: !this.state.hasGoal })}
                disabled = {App.getAppBoard().start}
              />
              <Text style={{
                fontSize: 16, 
                color: 'grey',  
                marginVertical: 5, 
                marginRight: 5 
              }}>
                Goal: 
              </Text>
              <TextInput
                style = {{
                    height: 36,
                    width: 50,
                }}
                placeholderTextColor = 'gray'
                placeholder = 'Input'
                onChangeText = {
                  (goal) => this.setState({
                    goal
                  })
                }
                value = {String(this.state.goal)}
                maxLength = {5}
                textAlign = {'center'}
                editable = {this.state.hasGoal}
                underlineColorAndroid = {'black'}
              />
            </View>
            */}
          </View>
          <View style = {{marginLeft: 30}}>
            <View style = {{flexDirection: 'row'}}>
              <Text style = {{
                fontSize: 16*scale, 
                color: 'grey',  
                marginVertical: 5, 
                marginRight: 5 
              }}>
                Vote limit: 
              </Text>
              <TextInput
                style={{
                  height: 36*scale, 
                  width: 50*scale,
                  fontSize: 16*scale
                }}
                placeholderTextColor = 'gray'
                placeholder = 'Input'
                onChangeText= {(numberOfVote) => this.setState({numberOfVote})}
                value = {String(this.state.numberOfVote)}
                maxLength = {5}
                textAlign={'center'}
                underlineColorAndroid = {'black'}
              />
            </View>
          </View>
          <View style = {{flex: 5 }}>
            <Text style={{fontSize: 20*scale, 
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
                      style={{width: 16*scale, height: 16*scale, marginTop: 8, marginLeft: 30}}
                      source={require('../../img/cross.png')}
                    />
                    </TouchableWithoutFeedback>
                    <Text 
                      style={{
                        fontSize: 18*scale, 
                        color: 'black',  
                        marginVertical: 5,
                        marginLeft: 10,
                      }}>
                        {tag}
                    </Text>
                </View>
              )
            })}
            <TouchableWithoutFeedback
                onPress = {() => this.setState({visibleNewTagModal: true})}
              >
                <View style = {{marginHorizontal: 30,}}>
                  <Text style = {{fontSize: 16*scale, color: '#70cdef'}}>
                    Add Tag
                  </Text>
                </View>
              </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default BoardManagerScreen;