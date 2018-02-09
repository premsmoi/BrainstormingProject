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

/*
### Color ### 
red = '#ff9999'
pink = '#ff99c2'
green = '#99ff99'
blue = '#99ffff'
yellow = '#ffff99'
*/
var noteColor = {'red': '#ff9999', 'pink': '#ff99c2', 'green': '#99ff99', 'blue': '#99ffff', 'yellow': '#ffff99'}
var borderColor = {'red': '#ff8080', 'pink': '#ff80b3', 'green': '#80ff80', 'blue': '#80ffff', 'yellow': '#ffff80'}
//var COLOR = 'blue';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this._panResponder = {};
    this.x = this.props.x;
    this.y = this.props.y;
    //this.COLOR = this.props.color;
    this.rectangle = (null : ?{ setNativeProps(props: Object): void });
    this.state = {
      lastPress: new Date().getTime(),
      text: this.props.text,
      nextText: this.props.text,
      COLOR: this.props.color,
      isVisibleModal: false,
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

   _renderModalContent = () => (
    <View style={
      {
        //width: 300, 
        //height: 300,
        //flex: 1, 
        //flexDirection: 'column',
        backgroundColor: noteColor[this.state.COLOR],
        //paddingTop: 8,
        //paddingHorizontal: 22,
        //justifyContent: "center",
        //alignItems: "center",
        //borderRadius: 8,
        //borderColor: "rgba(0, 0, 0, 0.1)"
      }
    }>
      
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
      
      <View style = {{flexDirection: 'row'}} >
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("OK", () => this.setState({ isVisibleModal: false, text: this.state.nextText}))}
        </View>
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("Cancel", () => this.setState({ isVisibleModal: false, nextText: this.state.text }))}
        </View>  
        <View style = {{flex: 1}}/>
        <View style = {{flex: 4}}>
          {this._renderButton("Delete", () => this.setState({ isVisibleModal: false, nextText: this.state.text }))}
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
          console.log(borderColor[this.state.COLOR])
          this.setState({ isVisibleModal: true })
        }

        this.setState({
        lastPress: new Date().getTime()
    })
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

  render() {
    return (
      <View>
        <Modal isVisible={this.state.isVisibleModal}>
          {this._renderModalContent()}
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

var styles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingTop: 64,
  },
  rectangle: {
    top: 0, 
    bottom: 0,
    width: 150,
    height: 150,
    position: 'absolute',
    elevation: 4,    
  },
  text: {
    marginTop   : 5,
    marginLeft  : 5,
    marginRight : 5,
    //textAlign   : 'center',
    color       : 'black'
  },
  button: {
    backgroundColor: "lightblue",
    //padding: 12,
    padding: 6,
    margin: 8,
    //margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});