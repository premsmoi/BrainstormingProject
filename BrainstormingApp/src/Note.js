import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput
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
    }
    this._rectangleStyles = {
      style: {
        left: this.x,
        top: this.y,
        backgroundColor: noteColor[this.state.COLOR],
      }
    };
  }

   _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

   _renderOpenNoteModal = () => (
    <View style={{backgroundColor: noteColor[this.state.COLOR],}}>
      <View>
        <TextInput
          style={{ 
            fontSize: 20,
            marginTop   : 15,
            marginLeft  : 15,
            marginRight : 15,
          }}
          onChangeText={(nextText) => this.setState({nextText})}
          value={this.state.nextText}
          multiline = {true}
          numberOfLines = {8}
          maxLength = {100}
        />
      </View>
      
      <View style = {{flexDirection: 'row'}} >
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("OK", () => {
            this.setState({ isVisibleOpenNoteModal: false, text: this.state.nextText})
            this.props.updateNoteText(this.id, this.state.nextText)
            this.props.setVisibleOpenNoteModal(false)
          })}
        </View>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("Cancel", () => {
            this.setState({ isVisibleOpenNoteModal: false, nextText: this.state.text })
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
        this.props.updateNotePosition(this.id, this.x, this.y);
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

  deleyForUpdate(){
    this.props.updateNotePosition(this.id, this.x, this.y);
    this.props.updateNoteList();
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