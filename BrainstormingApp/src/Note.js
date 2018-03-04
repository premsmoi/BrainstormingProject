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
} from "react-native";
import TimerMixin from 'react-timer-mixin';
import BoardScreen from './BoardScreen';
import styles from "./app.style";
import {noteColor, borderColor} from './colors'
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
    //this.COLOR = this.props.color;
    this.rectangle = (null : ?{ setNativeProps(props: Object): void });
    this.state = {
      lastPress: new Date().getTime(),
      text: this.props.text,
      nextText: this.props.text,
      COLOR: this.props.color,
      isVisibleOpenNoteModal: false,
      canMount: true,
      newColor: this.props.color,
      tags: ['A', 'B'],
    }
    this._rectangleStyles = {
      style: {
        left: this.x,
        top: this.y,
        backgroundColor: noteColor[this.state.COLOR],
      }
    };
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

   _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

   _renderSelectTagsModal = () => (
      <View style={{
        backgroundColor: noteColor[this.state.newColor],
        padding: 22,
        //justifyContent: "center",
        //alignItems: "center",
        borderRadius: 4,
      }}>
        <Text style={{fontSize: 20, 
            color: 'grey',  
            marginVertical: 20, 
            marginHorizontal: 20 
          }}>Tag List</Text>

      </View>
    )

   _renderOpenNoteModal = () => (
    <View style={{
      backgroundColor: noteColor[this.state.newColor],
      padding: 22,
      //justifyContent: "center",
      //alignItems: "center",
      borderRadius: 4,
    }}>
      <View style={{flexDirection: 'row', padding: 6, margin: 8,}}>
        {this._renderColorPicker('red')}
        {this._renderColorPicker('pink')}
        {this._renderColorPicker('green')}
        {this._renderColorPicker('blue')}
        {this._renderColorPicker('yellow')}
      </View>
      <View>
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
      </View>
      <View style = {{flexDirection: 'row'}} >
        <Text 
          style={{
            fontSize: 16, 
            color: 'grey',  
            marginVertical: 5, 
            marginLeft: 20 
          }}>Tags:</Text>
          {this.state.tags.map((tag) => {
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
          <TouchableOpacity onPress={}>
            <Image
              style={{width: 16, height: 16, marginTop: 8, marginLeft: 30}}
              source={require('../img/pencil.png')}
            />
          </TouchableOpacity>
      </View>
      <View style = {{flexDirection: 'row'}} >
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("OK", () => {
            this.setState({ isVisibleOpenNoteModal: false, text: this.state.nextText, COLOR: this.state.newColor})
            var updatedObj = {
              id: this.id,
              color: this.state.newColor,
              text: this.state.nextText,
              updated: new Date().getTime(),
            }
            console.log('color: '+this.state.newColor)
            //this.props.updateNoteText(this.id, this.state.nextText)
            this.props.updateNote(updatedObj)
            this.props.setVisibleOpenNoteModal(false)
          })}
        </View>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("Cancel", () => {
            this.setState({ isVisibleOpenNoteModal: false, nextText: this.state.text, newColor: this.state.COLOR})
           this.props.setVisibleOpenNoteModal(false)
          })}
        </View>  
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("Delete", () => {
            this.props.deleteNote(this.id)
            this.setState({isVisibleOpenNoteModal: false})
            this.props.setVisibleOpenNoteModal(false)
          })}
        </View>  
        <View style = {{flex: 1}}/>
      </View>  
    </View>
  );

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onMoveShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this._highlight();
        var delta = new Date().getTime() - this.state.lastPress;

        if(delta < 200) {
          // double tap happend
          //console.log(borderColor[this.state.COLOR])
          this.setState({ isVisibleOpenNoteModal: true })
          this.props.setVisibleOpenNoteModal(true)
        
        }
        console.log('Look ! isVisibleOpenNoteModal: '+this.props.isVisibleOpenNoteModal)

        this.setState({
        lastPress: new Date().getTime()
        })
        this.props.focusNote(this.id)
        console.log(this.id)
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
        this.props.updateNote(updatedObj)
        this.props.updateNoteList();
        
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
          <Text style={styles.text}>{this.state.text}</Text>
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