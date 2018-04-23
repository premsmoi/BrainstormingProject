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
} from "react-native";
import TimerMixin from 'react-timer-mixin';
import styles from "./../app.style";
import {noteColor, borderColor} from './../colors'
//var noteColor = {'red': '#ff9999', 'pink': '#ff99c2', 'green': '#99ff99', 'blue': '#99ffff', 'yellow': '#ffff99'}
//var borderColor = {'red': '#ff8080', 'pink': '#ff80b3', 'green': '#80ff80', 'blue': '#80ffff', 'yellow': '#ffff80'}
//var COLOR = 'blue';

export default class SmallNote extends Component {
  constructor(props) {
    super(props);
    this._panResponder = {};
    this.x = this.props.x;
    this.y = this.props.y;
    this.id = this.props.id;
    //this.COLOR = this.props.color;
    this.rectangle = (null : ?{ setNativeProps(props: Object): void });
    this.boardState = this.props.getState()
    this.state = {
      lastPress: new Date().getTime(),
      text: this.props.text,
      nextText: this.props.text,
      COLOR: this.props.color,
      //transparent: this.props.transparent,
      isVisibleOpenNoteModal: false,
      visibleSelectTagsModal: false,
      canMount: true,
      newColor: this.props.color,
      tags: this.props.tags,
      newNoteTags: [],
      tagSelection: {},
    }
    this._rectangleStyles = {
      style: {
        left: this.x,
        top: this.y,
        backgroundColor: noteColor[this.state.COLOR],
      }
    };
    this.boardState.tags.map((tag) => {
          let newTagSelection = this.state.tagSelection
          newTagSelection[tag] = false
          this.setState({ tagSelection: newTagSelection })
        })
    this.state.tags.map((tag) => {
          let newTagSelection = this.state.tagSelection
          newTagSelection[tag] = true
          this.setState({ tagSelection: newTagSelection })
        })
  }


  componentDidMount() {
    this._updateNativeStyles();
  }

  /*
  
  */

  render() {
    return (
      <View>
        <View
          ref={(rectangle) => {
            this.rectangle = rectangle;
          }}
          //style={styles.rectangle}
          style={{
            top: 0, 
            bottom: 0,
            width: 15,
            height: 15,
            position: 'absolute',
            elevation: 4, 
            borderColor: borderColor[this.state.COLOR],
            borderWidth: 0.5,
          }}
          {...this._panResponder.panHandlers}
        >
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