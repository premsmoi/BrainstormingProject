import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  Alert,
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Image,
  CheckBox,
  Picker,
} from "react-native";
import TimerMixin from 'react-timer-mixin';
import ImagePicker from 'react-native-image-picker';
import BoardScreen from './BoardScreen';
import styles from "./app.style";
import {noteColor, borderColor} from './colors'
import {renderButton, renderIconButton} from './RenderUtilities'
//var noteColor = {'red': '#ff9999', 'pink': '#ff99c2', 'green': '#99ff99', 'blue': '#99ffff', 'yellow': '#ffff99'}
//var borderColor = {'red': '#ff8080', 'pink': '#ff80b3', 'green': '#80ff80', 'blue': '#80ffff', 'yellow': '#ffff80'}
//var COLOR = 'blue';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this._panResponder = {};
    this.x = this.props.x;
    this.y = this.props.y;
    this.id = this.props.id;
    this.writer = this.props.writer;
    this.isOwner = this.props.writer == this.props.getUser().username;
    //console.log('isOwner: '+this.isOwner)
    //console.log('writer: '+this.props.writer)
    //console.log('user: '+this.props.getUser().username)
    //this.COLOR = this.props.color;
    this.rectangle = (null : ?{ setNativeProps(props: Object): void });
    this.boardState = this.props.getState()
    this.state = {
      lastPress: new Date().getTime(),
      img: this.props.img,
      newImgData: this.props.img.data,
      noteType: this.props.noteType,
      newNoteType: this.props.noteType,
      text: this.props.text,
      nextText: this.props.text,
      COLOR: this.props.color,
      voteScore: this.props.voteScore,
      //transparent: this.props.transparent,
      isVisibleOpenNoteModal: false,
      visibleSelectTagsModal: false,
      canMount: true,
      newColor: this.props.color,
      tags: this.props.tags,
      newNoteTags: this.props.tags,
      tagSelection: {},
      newTagSelection: {},
      voteStatus: this.props.getVoteStatus(this.id),
    }
    //console.log('data in note: '+JSON.stringify(this.state.img.data))
    //console.log('newNoteTags: '+this.state.newNoteTags)
    this._rectangleStyles = {
      style: {
        left: this.x,
        top: this.y,
        backgroundColor: noteColor[this.state.COLOR],
      }
    };
    this.boardState.tags.map((tag) => {
          let tempTagSelection = this.state.newTagSelection
          tempTagSelection[tag] = false
          //console.log('now tag: '+tag)
          //console.log('tempTagSelection: '+JSON.stringify(tempTagSelection)
          this.setState({ tagSelection: tempTagSelection }, () => {
            //this.setState({ newTagSelection: tempTagSelection })
          })
        })
    //console.log('start newTagSelection: '+JSON.stringify(this.state.newTagSelection))
    //console.log('start tagSelection: '+JSON.stringify(this.state.tagSelection))
    //console.log('newTagSelection: '+JSON.stringify(this.state.newTagSelection))
    this.state.tags.map((tag) => {
          let tempTagSelection = this.state.newTagSelection
          tempTagSelection[tag] = true
          //this.setState({ tagSelection: tempTagSelection , newTagSelection: tempTagSelection})
        })
  }

  uploadPicture(){
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    //this.setState({imgData: null})
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: 'data:image/jpg;base64,'+response.data };
        //console.log('data: '+String(response.data))
        this.setState({
          newImgData: response.data, 
        });
      }
    });
  }

  _renderColorPicker = (color) => (
    <TouchableOpacity onPress={() => this.setState({newColor: color})}>
      <View style={{
        backgroundColor: noteColor[color],
        borderColor: 'black',
        borderWidth: 0.5,
        width: 50,
        height: 50,}}>
      </View>
    </TouchableOpacity>
  );

   _renderOpenNoteModal = () => (
    <View style={{
      backgroundColor: noteColor[this.state.newColor],
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      borderRadius: 4,
    }}>
      {
        this.isOwner && (
          <View style={{flexDirection: 'row', padding: 6, margin: 8, justifyContent: 'center'}}>
            {this._renderColorPicker('red')}
            {this._renderColorPicker('pink')}
            {this._renderColorPicker('green')}
            {this._renderColorPicker('blue')}
            {this._renderColorPicker('yellow')}
          </View>
          )
      }
      
      <View style={{flexDirection: 'row', padding: 6, margin: 8}}>
        <Text style = {{
          fontSize: 14,
        }}>
          Type: 
        </Text>
        <Picker
          selectedValue={this.state.newNoteType}
          style={{ height: 20, width: 150 }}
          enabled = {this.isOwner? true : false}
          onValueChange={(newNoteType) => this.setState({newNoteType})}>
          <Picker.Item label="Text" value="text" />
          <Picker.Item label="Image" value="image" />
        </Picker>
      </View>
      <View>
        {
          this.state.newNoteType == 'text' && (
              <TextInput
                style={{ 
                  fontSize: 20,
                  marginTop   : 15,
                  marginLeft  : 15,
                  marginRight : 15,
                  textAlignVertical: "top",
                  //borderColor: 'black',
                  //borderWidth: 0.5,
                }}
                onChangeText={(nextText) => this.setState({nextText})}
                value={this.state.nextText}
                multiline = {true}
                numberOfLines = {6}
                maxLength = {100}
                placeholder = {'Text Here..'}
                underlineColorAndroid = {noteColor[this.state.newColor]}
              />
            )
        }
        {
          this.state.newNoteType == 'image' && (
            <View style = {{marginHorizontal: 15}}>
                <Image style={{ width: 300, height: 300 }} source={{uri: 'data:image/jpg;base64,'+this.state.newImgData}} />
              </View>
            )
        }
        
      </View>
      <View style = {{flexDirection: 'row'}} >
        <Text 
          style={{
            fontSize: 16, 
            color: 'grey',  
            marginVertical: 5, 
            marginLeft: 20 
          }}>Tags:</Text>
          {this.state.newNoteTags.map((tag) => {
            return(
              <Text 
                style={{
                  fontSize: 16, 
                  color: 'black',  
                  marginVertical: 5, 
                  marginHorizontal: 5 
                }}>
                {tag}
              </Text>
            )
          })}
          {
            this.isOwner && (
              <TouchableOpacity onPress = {() => {this.setState({visibleSelectTagsModal: true})}}>
                <Image
                  style={{width: 16, height: 16, marginTop: 8, marginLeft: 5}}
                  source={require('../img/pencil.png')}
                />
              </TouchableOpacity>
              )
          }
          
      </View>
        {
          this.isOwner && (
            <View>
              <View style = {{flexDirection: 'row'}} >
                <View style = {{flex: 1}}/>
                <View style = {{flex: 4}}>
                  {renderButton("OK", () => {
                    this.setState({ isVisibleOpenNoteModal: false, text: this.state.nextText, COLOR: this.state.newColor})
                   
                    console.log('color: '+this.state.newColor)
                    this.setState({
                      color: this.state.newColor,
                      text: this.state.nextText,
                      tags: this.state.newNoteTags,
                      tagSelection: this.state.newTagSelection,
                    })
                     var updatedObj = {
                      id: this.id,
                      color: this.state.newColor,
                      noteType: this.state.newNoteType,
                      text: this.state.nextText,
                      tags: this.state.newNoteTags,
                      updated: new Date().getTime(),
                      img: {
                        data: this.state.newImgData,
                        contentType: 'img/jpg',
                      },
                    }

                    var updatedObjWithoutImg = {
                      id: this.id,
                      color: this.state.newColor,
                      noteType: this.state.newNoteType,
                      text: this.state.nextText,
                      tags: this.state.newNoteTags,
                      updated: new Date().getTime(),
                    }
                    //console.log('data in note: '+this.props.getState().imgData)
                    this.props.updateNote(this.state.img.data == this.state.newImgData? updatedObjWithoutImg : updatedObj)
                    this.props.setVisibleOpenNoteModal(false)
                    //this.setState({newNoteTags: []})
                  })}
                </View>
                <View style = {{flex: 1}}/>

                <View style = {{flex: 4}}>
                  {renderButton("Cancel", () => {
                    console.log('newTagSelection: '+JSON.stringify(this.state.newTagSelection))
                      console.log('tagSelection: '+JSON.stringify(this.state.tagSelection))  
                    this.setState({
                      isVisibleOpenNoteModal: false,
                      nextText: this.state.text,
                      newColor: this.state.COLOR,
                      newNoteTags: this.state.tags,
                      newTagSelection: this.state.tagSelection,
                      newImgData: this.state.img.data,
                      newNoteType: this.state.noteType,
                    }, () => {
                      console.log('newTagSelection: '+JSON.stringify(this.state.newTagSelection))
                      console.log('tagSelection: '+JSON.stringify(this.state.tagSelection))  
                    })
                    this.props.updateNote({id: this.id})
                    this.props.setVisibleOpenNoteModal(false)
                  })}
                </View>  
                <View style = {{flex: 1}}/>
                <View style = {{flex: 4}}>
                  {renderButton("Delete", () => {
                    this.props.deleteNote(this.id)
                    this.setState({isVisibleOpenNoteModal: false})
                    this.props.setVisibleOpenNoteModal(false)
                  })}
                </View>  
                <View style = {{flex: 1}}/>
              </View>
              <View style = {{flexDirection: 'row'}}>
                <View style = {{flex: 1}}/>
                <View style = {{flex: 4}}>  
                  {renderButton(this.state.voteStatus? 'Unvote' : 'Vote', () => {
                    if(this.state.voteStatus){
                      this.props.unvoteNote(this.id)
                      this.setState({voteStatus: false, voteScore: this.state.voteScore--})
                    }
                    else{
                      this.props.voteNote(this.id)
                      this.setState({voteStatus: true, voteScore: this.state.voteScore++})
                    }
                  })}
                </View>
                <View style = {{flex: 1}}/>
                <View style = {{flex: 9}}>
                  {
                    this.state.newNoteType == 'image' && renderButton('Upload Image', () => {
                      this.uploadPicture();
                    })
                  }
                </View>
                <View style = {{flex: 1}}/>
              </View>
            </View>
            )
        }
        {
          !this.isOwner && 
            renderButton(this.state.voteStatus? 'Unvote' : 'Vote', () => {
                    if(this.state.voteStatus){
                      this.props.unvoteNote(this.id)
                      this.setState({voteStatus: false, voteScore: this.state.voteScore--})
                    }
                    else{
                      this.props.voteNote(this.id)
                      this.setState({voteStatus: true, voteScore: this.state.voteScore++})
                    }
                  })
        }
        {
          !this.isOwner &&
            renderButton('OK', () => {
              this.setState({isVisibleOpenNoteModal: false})
              this.props.updateNote({id: this.id})
              this.props.setVisibleOpenNoteModal(false)

            })
        }
      
    </View>
  );

   _renderSelectTagsModal = () => (
    <View style={{
      backgroundColor: 'white',
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      //borderRadius: 4,
    }}>
      { 
        this.boardState.tags.map((tag) => {
        return(
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              value={this.state.newTagSelection[tag]}
              onValueChange={() => {
                let tempTagSelection = this.state.newTagSelection
                tempTagSelection[tag] = !tempTagSelection[tag]
                this.setState({ newTagSelection: tempTagSelection })
                console.log(this.state.newTagSelection)
              }
              }
            />
            <Text style={{marginTop: 5}}>{tag}</Text>
          </View>
        )
      })}
      {renderButton("OK", () => {
        this.setState({ visibleSelectTagsModal: false })
        let newTags = [];
        this.setState({newNoteTags: []})
        this.boardState.tags.map((tag) => {
          if(this.state.newTagSelection[tag]){
              newTags.push(tag)
              console.log('newTags: '+newTags)
              this.setState({newNoteTags: []}, () => {
                this.setState({newNoteTags: newTags}, () => {
                   console.log('newNoteTags: '+this.state.newNoteTags)
                })
              })
          }
        })
        
      })}
    </View>
  )

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onMoveShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this._highlight();
        var delta = new Date().getTime() - this.props.getLastPress().time;
        console.log(delta)
        if(delta < 500) {
          // double tap happend
          //console.log(borderColor[this.state.COLOR])
          this.setState({ isVisibleOpenNoteModal: true })
          this.props.setVisibleOpenNoteModal(true)
          console.log('Double')
        
        }
        //console.log('Look ! isVisibleOpenNoteModal: '+this.props.isVisibleOpenNoteModal)

        /*this.setState({
        lastPress: new Date().getTime()
        })*/
        this.props.setLastPress({ time: new Date().getTime(), noteId: this.id })
        this.props.focusNote(this.id)
        //console.log(this.id)
      },
      onPanResponderMove: (e, gesture) => {
        this._rectangleStyles.style.left = this.x + gesture.dx;
        this._rectangleStyles.style.top = this.y + gesture.dy;
        this._updateNativeStyles();
      },
      onPanResponderRelease: (e, gesture) => {
        this._unHighlight();
        this.x += gesture.dx;
        this.y += gesture.dy;

        //this.props.updateNotePosition(this.id, this.x, this.y);
        var updatedObj = {
              id: this.id,
              x: this.x,
              y: this.y,
              updated: new Date().getTime(),
            }
        setTimeout(() => {
          this.props.updateNote(updatedObj)
          //this.props.updateNoteList();
        }, 200)
        
      },
      onPanResponderTerminate: (e, gesture) => {
        this._unHighlight();
        this.x += gesture.dx;
        this.y += gesture.dy;
      },
    });

    
  };

  componentDidMount() {
    this._updateNativeStyles();
  }

  /*
  
  */

  render() {
    return (
      <View>
        <Modal isVisible={this.state.isVisibleOpenNoteModal}>
          {this._renderOpenNoteModal()}
        </Modal>
        <Modal isVisible={this.state.visibleSelectTagsModal}>
          {this._renderSelectTagsModal()}
        </Modal>
        <View
          ref={(rectangle) => {
            this.rectangle = rectangle;
          }}
          //style={styles.rectangle}
          style={{
            top: 0, 
            bottom: 0,
            width: 150,
            height: 150,
            position: 'absolute',
            elevation: 4, 
            borderColor: borderColor[this.state.COLOR],
            borderWidth: 0.5,
          }}
          {...this._panResponder.panHandlers}
        >
          <View style = {{flex: 1, flexDirection: 'row'}}>
            <View style = {{flex: 7}}/>
            <View style = {{flex: 1}}>
            {
              this.props.getVoteStatus(this.id) && 
                <Image 
                  style={{width: 16, height: 16, marginTop: 5, /*marginHorizontal: 10*/}}
                  source={require('../img/star.png')}
                />
            
            }
            </View>
          </View>
          <View style = {{flex: 7}}>
          {
            this.state.noteType == 'text' && (
                <Text style={{
                  fontSize: 14,
                  //marginVertical: 10,
                  marginHorizontal: 10,
                  color: 'black',
                }}>{this.state.text}</Text>
              )
          }
          {
            this.state.noteType == 'image' && (
              <View style = {{marginHorizontal: 15}}>
                <Image style={{ width: 115, height: 115 }} source={{uri: 'data:image/jpg;base64,'+this.state.img.data}} />
              </View>
            )
          }
          </View>
          <View style = {{flex: 1, padding: 5}}>
            <Text style={{
              fontSize: 14,
              //marginBottom: 10,
              //marginHorizontal: 10,
              color: 'black',
            }}>{'Votes: '+this.state.voteScore}</Text>
          </View>
        </View>
        
      </View>
     
    );
  }

  _highlight() {
    //this._rectangleStyles.style.backgroundColor = 'red';
    this._updateNativeStyles();
  }

  _unHighlight() {
    this._rectangleStyles.style.backgroundColor = noteColor[this.state.COLOR];
    this._updateNativeStyles();
  }

  _updateNativeStyles() {
    this.rectangle && this.rectangle.setNativeProps(this._rectangleStyles);
  }

}